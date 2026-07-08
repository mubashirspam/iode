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
  const [uni] = await db
    .select()
    .from(universities)
    .where(eq(universities.slug, slug))
    .limit(1);
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
  const [fee] = await db
    .select()
    .from(courseFeeStructures)
    .where(eq(courseFeeStructures.courseId, course.id))
    .limit(1);
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
}
