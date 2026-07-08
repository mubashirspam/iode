<<<<<<< HEAD
import { db } from ".";
import {
  universities,
  courses,
  courseCategories,
  courseFeeStructures,
  adminUsers,
} from "./schema";
import { eq, sql, ilike, or, asc, desc, inArray, and, isNotNull } from "drizzle-orm";

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
=======
import "server-only";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  universities,
  courses,
  courseFeeStructures,
  courseFeeBreakdowns,
  type University,
  type Course,
  type CourseFeeStructure,
  type CourseFeeBreakdown,
  type UniversityHighlights,
} from "@/lib/db/schema";

export type CourseWithFee = Course & { fee: CourseFeeStructure | null };
export type UniversityWithCourses = University & { courses: CourseWithFee[] };

const num = (v: string | null | undefined) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

/** All active universities with their courses + fee rows (single round trips). */
export async function getUniversitiesWithCourses(): Promise<
  UniversityWithCourses[]
> {
  const [unis, allCourses, allFees] = await Promise.all([
    db
      .select()
      .from(universities)
      .where(eq(universities.isActive, true))
      .orderBy(asc(universities.name)),
    db.select().from(courses),
    db.select().from(courseFeeStructures),
  ]);
  const feeByCourse = new Map(allFees.map((f) => [f.courseId, f]));
  return unis.map((u) => ({
    ...u,
    courses: allCourses
      .filter((c) => c.universityId === u.id)
      .map((c) => ({ ...c, fee: feeByCourse.get(c.id) ?? null })),
  }));
}

/** Cheapest visible starting fee across a university's courses. */
export function uniStartingFee(u: UniversityWithCourses) {
  let best: { amount: number; unit: string } | null = null;
  for (const c of u.courses) {
    if (!c.fee || c.fee.feeOnRequest) continue;
    const amount = num(c.fee.startingFee);
    if (amount == null) continue;
    if (!best || amount < best.amount)
      best = { amount, unit: c.fee.startingFeeUnit ?? "" };
  }
  return best;
}

export function uniDegreeKeys(u: UniversityWithCourses): string[] {
  return [...new Set(u.courses.map((c) => c.shortName).filter(Boolean))] as string[];
}

export function uniHighlights(u: University): UniversityHighlights {
  return (u.highlights ?? {}) as UniversityHighlights;
}

export async function getUniversityBySlug(
  slug: string
): Promise<UniversityWithCourses | null> {
>>>>>>> feat/university-course-experience
  const [uni] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);
<<<<<<< HEAD

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

  return { ...uni, courses: uniCourses };
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

=======
  if (!uni || !uni.isActive) return null;
  const uniCourses = await db
    .select()
    .from(courses)
    .where(eq(courses.universityId, uni.id))
    .orderBy(asc(courses.name));
  const fees = await db.select().from(courseFeeStructures);
  const feeByCourse = new Map(fees.map((f) => [f.courseId, f]));
  return {
    ...uni,
    courses: uniCourses.map((c) => ({ ...c, fee: feeByCourse.get(c.id) ?? null })),
  };
}

export type CourseDetail = {
  course: Course;
  university: University;
  fee: CourseFeeStructure | null;
  breakdowns: CourseFeeBreakdown[];
};

export async function getCourseDetail(
  uniSlug: string,
  courseSlug: string
): Promise<CourseDetail | null> {
  const [uni] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, uniSlug))
    .limit(1);
  if (!uni || !uni.isActive) return null;
  const rows = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, courseSlug));
  const course = rows.find((c) => c.universityId === uni.id);
  if (!course) return null;
>>>>>>> feat/university-course-experience
  const [fee] = await db
    .select()
    .from(courseFeeStructures)
    .where(eq(courseFeeStructures.courseId, course.id))
    .limit(1);
<<<<<<< HEAD

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
=======
  const breakdowns = fee
    ? await db
        .select()
        .from(courseFeeBreakdowns)
        .where(eq(courseFeeBreakdowns.feeStructureId, fee.id))
        .orderBy(asc(courseFeeBreakdowns.sortOrder))
    : [];
  return { course, university: uni, fee: fee ?? null, breakdowns };
}

export type DegreeOffering = {
  course: Course;
  fee: CourseFeeStructure | null;
  university: University;
};

/** All courses for a degree key (courses.shortName), cheapest first. */
export async function getCoursesByDegree(
  degreeKey: string
): Promise<DegreeOffering[]> {
  const rows = await db
    .select({
      course: courses,
      fee: courseFeeStructures,
      university: universities,
    })
    .from(courses)
    .innerJoin(universities, eq(courses.universityId, universities.id))
    .leftJoin(
      courseFeeStructures,
      eq(courseFeeStructures.courseId, courses.id)
    )
    .where(eq(courses.shortName, degreeKey));
  return rows
    .filter((r) => r.university.isActive)
    .sort((a, b) => {
      const av = a.fee && !a.fee.feeOnRequest ? num(a.fee.startingFee) : null;
      const bv = b.fee && !b.fee.feeOnRequest ? num(b.fee.startingFee) : null;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return av - bv;
    });
}

export type DegreeGroup = {
  key: string;
  universityCount: number;
  courseCount: number;
  minStartingFee: number | null;
};

/** Degree keys grouped across all universities, for /courses browsing. */
export async function getDegreeGroups(): Promise<DegreeGroup[]> {
  const rows = await db
    .select({
      shortName: courses.shortName,
      universityId: courses.universityId,
      startingFee: courseFeeStructures.startingFee,
      feeOnRequest: courseFeeStructures.feeOnRequest,
      isActive: universities.isActive,
    })
    .from(courses)
    .innerJoin(universities, eq(courses.universityId, universities.id))
    .leftJoin(
      courseFeeStructures,
      eq(courseFeeStructures.courseId, courses.id)
    );
  const groups = new Map<
    string,
    { unis: Set<string>; count: number; min: number | null }
  >();
  for (const r of rows) {
    if (!r.shortName || !r.isActive) continue;
    const g = groups.get(r.shortName) ?? {
      unis: new Set<string>(),
      count: 0,
      min: null,
    };
    g.count++;
    if (r.universityId) g.unis.add(r.universityId);
    if (!r.feeOnRequest) {
      const v = num(r.startingFee);
      if (v != null && (g.min == null || v < g.min)) g.min = v;
    }
    groups.set(r.shortName, g);
  }
  return [...groups.entries()].map(([key, g]) => ({
    key,
    universityCount: g.unis.size,
    courseCount: g.count,
    minStartingFee: g.min,
  }));
>>>>>>> feat/university-course-experience
}
