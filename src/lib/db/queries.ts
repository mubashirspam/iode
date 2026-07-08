import { db } from ".";
import {
  universities,
  courses,
  courseCategories,
  courseFeeStructures,
  courseFeeBreakdowns,
  adminUsers,
} from "./schema";
import { eq, sql, ilike, or, asc, desc, inArray, and, isNotNull } from "drizzle-orm";
import type { UniversityHighlights } from "./schema";

// ─── Admin Stats ────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [uniCount] = await db.select({ count: sql<number>`count(*)` }).from(universities);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses);
  const [catCount] = await db.select({ count: sql<number>`count(*)` }).from(courseCategories);
  const [feeCount] = await db.select({ count: sql<number>`count(*)` }).from(courseFeeStructures);
  return {
    universities: Number(uniCount.count),
    courses: Number(courseCount.count),
    categories: Number(catCount.count),
    feeRecords: Number(feeCount.count),
  };
}

// ─── Universities ────────────────────────────────────────────────────────────

export async function getUniversities() {
  const rows = await db
    .select({
      id: universities.id,
      name: universities.name,
      shortName: universities.shortName,
      slug: universities.slug,
      code: universities.code,
      bannerImage: universities.bannerImage,
      logoUrl: universities.logoUrl,
      universityType: universities.universityType,
      state: universities.state,
      city: universities.city,
      website: universities.website,
      isActive: universities.isActive,
      highlights: universities.highlights,
      updatedAt: universities.updatedAt,
      courseCount: sql<number>`(
        SELECT count(*) FROM courses WHERE courses.university_id = universities.id
      )`,
    })
    .from(universities)
    .where(eq(universities.isActive, true))
    .orderBy(asc(universities.name));

  return rows;
}

// Powers the homepage "Top universities we work with" carousel. Returns active
// universities (newest first) enriched with a handful of their course names so
// the cards can render course chips, plus flags for "New" / "Admissions Open".
export type HomeUniversity = {
  id: string;
  name: string;
  shortName: string | null;
  slug: string | null;
  logoUrl: string | null;
  bannerImage: string | null;
  universityType: string | null;
  city: string | null;
  state: string | null;
  courseCount: number;
  isNew: boolean;
  admissionOpen: boolean;
  courseChips: { name: string; isNew: boolean }[];
};

const NEW_WINDOW_MS = 45 * 24 * 60 * 60 * 1000; // 45 days

export async function getHomeUniversities(limit = 12): Promise<HomeUniversity[]> {
  const unis = await db
    .select({
      id: universities.id,
      name: universities.name,
      shortName: universities.shortName,
      slug: universities.slug,
      logoUrl: universities.logoUrl,
      bannerImage: universities.bannerImage,
      universityType: universities.universityType,
      city: universities.city,
      state: universities.state,
      highlights: universities.highlights,
      createdAt: universities.createdAt,
      courseCount: sql<number>`(
        SELECT count(*) FROM courses WHERE courses.university_id = universities.id
      )`,
    })
    .from(universities)
    .where(eq(universities.isActive, true))
    .orderBy(desc(universities.createdAt))
    .limit(limit);

  if (unis.length === 0) return [];

  // One extra query for every relevant course, grouped in JS — avoids N+1.
  const uniIds = unis.map((u) => u.id);
  const courseRows = await db
    .select({
      universityId: courses.universityId,
      name: courses.name,
      shortName: courses.shortName,
      tags: courses.tags,
      createdAt: courses.createdAt,
    })
    .from(courses)
    .where(inArray(courses.universityId, uniIds))
    .orderBy(desc(courses.createdAt));

  const now = Date.now();
  const isFresh = (d: Date | null) => !!d && now - new Date(d).getTime() < NEW_WINDOW_MS;

  const byUni = new Map<string, { name: string; isNew: boolean }[]>();
  for (const c of courseRows) {
    if (!c.universityId) continue;
    const list = byUni.get(c.universityId) ?? [];
    if (list.length >= 6) continue; // cap chips per card
    const taggedNew = (c.tags ?? []).some((t) => t.toLowerCase() === "new");
    list.push({
      name: c.shortName?.trim() || c.name,
      isNew: taggedNew || isFresh(c.createdAt),
    });
    byUni.set(c.universityId, list);
  }

  return unis.map((u) => {
    const h = (u.highlights ?? {}) as { admissionOpen?: boolean };
    return {
      id: u.id,
      name: u.name,
      shortName: u.shortName,
      slug: u.slug,
      logoUrl: u.logoUrl,
      bannerImage: u.bannerImage,
      universityType: u.universityType,
      city: u.city,
      state: u.state,
      courseCount: Number(u.courseCount),
      isNew: isFresh(u.createdAt),
      admissionOpen: h.admissionOpen === true,
      courseChips: byUni.get(u.id) ?? [],
    };
  });
}

// Lightweight list for the homepage logo marquee — every active university that
// has a logo, name + slug only. Ordered by name for a stable strip.
export type MarqueeUniversity = {
  name: string;
  slug: string | null;
  logoUrl: string;
};

export async function getUniversityLogos(): Promise<MarqueeUniversity[]> {
  const rows = await db
    .select({
      name: universities.name,
      slug: universities.slug,
      logoUrl: universities.logoUrl,
    })
    .from(universities)
    .where(and(eq(universities.isActive, true), isNotNull(universities.logoUrl)))
    .orderBy(asc(universities.name));

  return rows.filter((r): r is MarqueeUniversity => !!r.logoUrl);
}

export async function getUniversityById(id: string) {
  const [uni] = await db.select().from(universities).where(eq(universities.id, id)).limit(1);
  return uni ?? null;
}

export async function getUniversityBySlug(slug: string) {
  const [uni] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);

  if (!uni) return null;

  const uniCourses = await db
    .select({
      id: courses.id,
      name: courses.name,
      shortName: courses.shortName,
      slug: courses.slug,
      courseType: courses.courseType,
      deliveryMode: courses.deliveryMode,
      durationYears: courses.durationYears,
      totalSemesters: courses.totalSemesters,
      bannerImage: courses.bannerImage,
      description: courses.description,
      isOnline: courses.isOnline,
      isDistance: courses.isDistance,
      tags: courses.tags,
      totalFee: sql<string>`(
        SELECT total_fee FROM course_fee_structures WHERE course_id = courses.id LIMIT 1
      )`,
    })
    .from(courses)
    .where(eq(courses.universityId, uni.id))
    .orderBy(asc(courses.name));

  // Fetch fee structures for all courses
  const coursesWithFees = await Promise.all(
    uniCourses.map(async (course) => {
      const [fee] = await db
        .select()
        .from(courseFeeStructures)
        .where(eq(courseFeeStructures.courseId, course.id))
        .limit(1);
      return {
        ...course,
        fee: fee ?? null,
      };
    })
  );

  return { ...uni, courses: coursesWithFees };
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export type CourseFilter = {
  search?: string;
  courseType?: string;
  deliveryMode?: string;
  universityId?: string;
  sortBy?: "fee_asc" | "fee_desc" | "name_asc";
};

export async function getCourses(filter: CourseFilter = {}) {
  const conditions = [];
  if (filter.courseType) conditions.push(eq(courses.courseType, filter.courseType));
  if (filter.deliveryMode) conditions.push(eq(courses.deliveryMode, filter.deliveryMode));
  if (filter.universityId) conditions.push(eq(courses.universityId, filter.universityId));
  if (filter.search) {
    conditions.push(
      or(
        ilike(courses.name, `%${filter.search}%`),
        ilike(universities.name, `%${filter.search}%`)
      )
    );
  }

  const orderCol =
    filter.sortBy === "fee_asc"
      ? asc(sql`total_fee_sub`)
      : filter.sortBy === "fee_desc"
      ? desc(sql`total_fee_sub`)
      : asc(courses.name);

  const rows = await db
    .select({
      id: courses.id,
      name: courses.name,
      shortName: courses.shortName,
      slug: courses.slug,
      courseType: courses.courseType,
      deliveryMode: courses.deliveryMode,
      durationYears: courses.durationYears,
      bannerImage: courses.bannerImage,
      description: courses.description,
      isOnline: courses.isOnline,
      isDistance: courses.isDistance,
      tags: courses.tags,
      universityId: courses.universityId,
      universityName: universities.name,
      universitySlug: universities.slug,
      categoryName: courseCategories.name,
      totalFee: sql<string | null>`(
        SELECT total_fee FROM course_fee_structures WHERE course_id = courses.id LIMIT 1
      )`.as("total_fee_sub"),
    })
    .from(courses)
    .leftJoin(universities, eq(courses.universityId, universities.id))
    .leftJoin(courseCategories, eq(courses.categoryId, courseCategories.id))
    .where(conditions.length > 0 ? sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}` : undefined)
    .orderBy(orderCol);

  return rows;
}

export async function getCourseById(id: string) {
  const [course] = await db
    .select({
      id: courses.id,
      name: courses.name,
      shortName: courses.shortName,
      slug: courses.slug,
      courseType: courses.courseType,
      deliveryMode: courses.deliveryMode,
      durationYears: courses.durationYears,
      totalSemesters: courses.totalSemesters,
      eligibility: courses.eligibility,
      description: courses.description,
      content: courses.content,
      bannerImage: courses.bannerImage,
      isOnline: courses.isOnline,
      isDistance: courses.isDistance,
      tags: courses.tags,
      universityId: courses.universityId,
      categoryId: courses.categoryId,
      createdAt: courses.createdAt,
      updatedAt: courses.updatedAt,
      universityName: universities.name,
      universitySlug: universities.slug,
      categoryName: courseCategories.name,
    })
    .from(courses)
    .leftJoin(universities, eq(courses.universityId, universities.id))
    .leftJoin(courseCategories, eq(courses.categoryId, courseCategories.id))
    .where(eq(courses.id, id))
    .limit(1);

  if (!course) return null;

  const [fee] = await db
    .select()
    .from(courseFeeStructures)
    .where(eq(courseFeeStructures.courseId, id))
    .limit(1);

  return { ...course, feeStructure: fee ?? null };
}

export async function getCourseBySlug(uniSlug: string, courseSlug: string) {
  const uni = await getUniversityBySlug(uniSlug);
  if (!uni) return null;

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug))
    .limit(1);

  if (!course || course.universityId !== uni.id) return null;

  const [fee] = await db
    .select()
    .from(courseFeeStructures)
    .where(eq(courseFeeStructures.courseId, course.id))
    .limit(1);

  // Other courses from same university
  const sibling = await db
    .select({ id: courses.id, name: courses.name, slug: courses.slug, courseType: courses.courseType, bannerImage: courses.bannerImage, totalFee: sql<string>`(SELECT total_fee FROM course_fee_structures WHERE course_id = courses.id LIMIT 1)` })
    .from(courses)
    .where(eq(courses.universityId, uni.id))
    .limit(5);

  return {
    ...course,
    feeStructure: fee ?? null,
    university: uni,
    siblingCourses: sibling.filter((c) => c.id !== course.id).slice(0, 4),
  };
}

// ─── Admin users ──────────────────────────────────────────────────────────────

export async function getAdminUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase().trim()))
    .limit(1);
  return user ?? null;
}

// ─── Course Detail with Fee Breakdown ───────────────────────────────────────

export async function getCourseDetail(uniSlug: string, courseSlug: string) {
  const uni = await getUniversityBySlug(uniSlug);
  if (!uni) return null;

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug))
    .limit(1);

  if (!course || course.universityId !== uni.id) return null;

  const [fee] = await db
    .select()
    .from(courseFeeStructures)
    .where(eq(courseFeeStructures.courseId, course.id))
    .limit(1);

  const breakdowns = await db
    .select()
    .from(courseFeeBreakdowns)
    .where(eq(courseFeeBreakdowns.feeStructureId, fee?.id ?? ""))
    .orderBy(courseFeeBreakdowns.sortOrder);

  return {
    course,
    university: uni,
    fee: fee ?? null,
    breakdowns,
  };
}

// ─── University Highlights Helper ─────────────────────────────────────────────

export function uniHighlights(university: { highlights: unknown }): UniversityHighlights {
  return (university.highlights as UniversityHighlights) ?? {};
}

// ─── University Helper Functions ─────────────────────────────────────────────

export function uniStartingFee(university: { courses: Array<{ fee?: { startingFee?: string | null; startingFeeUnit?: string | null; feeOnRequest?: boolean | null } | null }> }): { amount: number; unit: string } | null {
  for (const course of university.courses) {
    if (course.fee && course.fee.startingFee && !course.fee.feeOnRequest) {
      const amount = parseFloat(course.fee.startingFee);
      if (Number.isFinite(amount) && amount > 0) {
        return { amount, unit: course.fee.startingFeeUnit ?? "per year" };
      }
    }
  }
  return null;
}

export function uniDegreeKeys(university: { courses: Array<{ courseType?: string | null }> }): string[] {
  const degrees = new Set<string>();
  for (const course of university.courses) {
    if (course.courseType) {
      degrees.add(course.courseType);
    }
  }
  return Array.from(degrees);
}

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type UniversityWithCourses = Awaited<ReturnType<typeof getUniversityBySlug>>;

// ─── Universities with Courses (for suggest page) ───────────────────────────

export async function getUniversitiesWithCourses() {
  const unis = await getUniversities();
  const results = [];
  for (const uni of unis) {
    const uniWithCourses = await getUniversityBySlug(uni.slug ?? "");
    if (uniWithCourses) {
      // Fetch fee structures for all courses
      const coursesWithFees = await Promise.all(
        uniWithCourses.courses.map(async (course) => {
          const [fee] = await db
            .select()
            .from(courseFeeStructures)
            .where(eq(courseFeeStructures.courseId, course.id))
            .limit(1);
          return {
            ...course,
            fee: fee ?? null,
            specializations: course.tags ?? [], // Use tags as specializations
          };
        })
      );
      results.push({
        ...uniWithCourses,
        courses: coursesWithFees,
      });
    }
  }
  return results;
}

// ─── Courses by Degree (for degree comparison page) ─────────────────────────

export async function getCoursesByDegree(degreeKey: string) {
  const courses = await getCourses({ courseType: degreeKey });
  // Transform flat structure to nested structure expected by the page
  const results = [];
  for (const c of courses) {
    const [fee] = await db
      .select()
      .from(courseFeeStructures)
      .where(eq(courseFeeStructures.courseId, c.id))
      .limit(1);
    
    results.push({
      course: {
        id: c.id,
        name: c.name,
        shortName: c.shortName,
        slug: c.slug,
        courseType: c.courseType,
        deliveryMode: c.deliveryMode,
        durationYears: c.durationYears,
        specializations: c.tags ?? [], // Use tags as specializations
      },
      university: {
        id: c.universityId ?? "",
        name: c.universityName,
        shortName: c.universityName,
        slug: c.universitySlug,
        highlights: null, // Will be fetched separately
      },
      fee: fee ?? null,
    });
  }
  return results;
}
