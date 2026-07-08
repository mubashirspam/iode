/**
 * Idempotent seed of the 2026 university + course fee data into the shared DB.
 *
 * - Upserts categories, universities and courses by slug (falls back to
 *   case-insensitive name match so existing rows with different slugs are
 *   updated, not duplicated).
 * - REPLACES each seeded course's fee structure + installment breakdown rows.
 * - Never deletes anything; existing universities/courses that are not in the
 *   seed data are reported at the end so they can be reviewed in the admin.
 * - Never overwrites admin-managed assets (logoUrl, bannerImage, content).
 *
 * Usage:
 *   npx tsx scripts/seed-university-data.ts           # staging (DATABASE_URL)
 *   npx tsx scripts/seed-university-data.ts --dry     # print actions only
 *   npx tsx scripts/seed-university-data.ts --prod    # production DB
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, inArray } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import type { OtherFee } from "../src/lib/db/schema";
import { resolveDatabaseUrl } from "./env";
import {
  CATS,
  DATA,
  type RawCourse,
  type RawUniversity,
} from "./data/university-fee-data";

const {
  universities,
  courseCategories,
  courses,
  courseFeeStructures,
  courseFeeBreakdowns,
} = schema;

const DRY = process.argv.includes("--dry");

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[&]/g, " and ")
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const parseYears = (dur: string) => {
  const m = dur.match(/(\d+)/);
  return m ? Number(m[1]) : 1;
};

const num = (s: string) => Number(s.replace(/,/g, ""));

type Installment = {
  label: string;
  amount: number;
  periodType: "year" | "semester" | "one_time";
  periodNumber: number;
  note?: string;
};

type ParsedFees = {
  paymentCycle: "yearly" | "semester" | "one_time" | null;
  installments: Installment[];
  yearlyFee: number | null;
  courseFee: number | null;
  startingFee: number | null;
  startingFeeUnit: string | null;
  extraOtherFees: OtherFee[];
};

/**
 * Parse the guide's human-readable `brk` string into structured rows.
 * Mirrors the rendering rules the HTML guide itself used (feeRows/startFee).
 */
function parseBreakdown(c: RawCourse): ParsedFees {
  const empty: ParsedFees = {
    paymentCycle: null,
    installments: [],
    yearlyFee: null,
    courseFee: null,
    startingFee: null,
    startingFeeUnit: null,
    extraOtherFees: [],
  };
  if (c.total == null) return empty;

  const years = parseYears(c.dur);
  const b = c.brk;
  let m: RegExpMatchArray | null;

  // "₹16,000 / year (Sem: ₹8,000)"
  m = b.match(/^₹([\d,]+) \/ year(?: \(Sem: ₹([\d,]+)\))?/);
  if (m) {
    const yearly = num(m[1]);
    const sem = m[2] ? num(m[2]) : null;
    return {
      paymentCycle: "yearly",
      installments: Array.from({ length: years }, (_, i) => ({
        label: `Year ${i + 1}`,
        amount: yearly,
        periodType: "year",
        periodNumber: i + 1,
        note: sem ? `Payable ₹${m![2]} per semester` : undefined,
      })),
      yearlyFee: yearly,
      courseFee: null,
      startingFee: sem ?? yearly,
      startingFeeUnit: sem ? "per semester" : "per year",
      extraOtherFees: [],
    };
  }

  // "₹12,500 / semester × 6"
  m = b.match(/^₹([\d,]+) \/ semester × (\d+)/);
  if (m) {
    const sem = num(m[1]);
    const count = Number(m[2]);
    return {
      paymentCycle: "semester",
      installments: Array.from({ length: count }, (_, i) => ({
        label: `Semester ${i + 1}`,
        amount: sem,
        periodType: "semester",
        periodNumber: i + 1,
      })),
      yearlyFee: null,
      courseFee: null,
      startingFee: sem,
      startingFeeUnit: "per semester",
      extraOtherFees: [],
    };
  }

  // "₹25,000 (Sem: ₹12,500 × 2)"  — 1-year program payable in 2 semesters
  m = b.match(/^₹([\d,]+) \(Sem: ₹([\d,]+) × (\d+)\)/);
  if (m) {
    const sem = num(m[2]);
    const count = Number(m[3]);
    return {
      paymentCycle: "semester",
      installments: Array.from({ length: count }, (_, i) => ({
        label: `Semester ${i + 1}`,
        amount: sem,
        periodType: "semester",
        periodNumber: i + 1,
      })),
      yearlyFee: num(m[1]),
      courseFee: null,
      startingFee: sem,
      startingFeeUnit: "per semester",
      extraOtherFees: [],
    };
  }

  // "₹23,500 (single year)"
  m = b.match(/^₹([\d,]+) \(single year\)/);
  if (m) {
    const amount = num(m[1]);
    return {
      paymentCycle: "yearly",
      installments: [
        { label: "Year 1", amount, periodType: "year", periodNumber: 1 },
      ],
      yearlyFee: amount,
      courseFee: null,
      startingFee: amount,
      startingFeeUnit: "first year",
      extraOtherFees: [],
    };
  }

  // "University Fee ₹5,500 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990"
  if (b.startsWith("University Fee")) {
    const parts = b.split("·").map((p) => p.trim());
    let courseFee: number | null = null;
    const extraOtherFees: OtherFee[] = [];
    for (const p of parts) {
      const am = p.match(/₹([\d,]+)/);
      if (!am) continue;
      const label = p.replace(/₹[\d,]+/, "").trim();
      if (/^university fee/i.test(label)) courseFee = num(am[1]);
      else
        extraOtherFees.push({
          label,
          amount: num(am[1]),
          recurrence: "one_time",
          included: true,
        });
    }
    return {
      paymentCycle: "one_time",
      installments: [],
      yearlyFee: null,
      courseFee,
      startingFee: c.sf ? c.sf.a : courseFee,
      startingFeeUnit: c.sf ? c.sf.unit : "one-time",
      extraOtherFees,
    };
  }

  // "1st Yr ₹13,500 · 2nd Yr ₹12,000 · 3rd Yr ₹12,000"
  // "Sem 1: ₹45,000 · Sem 2–4: ₹50,000 each"
  // "Registration ₹500 (one-time) · Sem 1: ₹18,050 · Sem 2–6: ₹16,250 each"
  if (b.includes("·")) {
    const installments: Installment[] = [];
    for (const raw of b.split("·")) {
      const p = raw.trim();
      const am = p.match(/₹([\d,]+)/);
      if (!am) continue;
      const amount = num(am[1]);

      let ym = p.match(/^(\d)(?:st|nd|rd|th) Yr/);
      if (ym) {
        const n = Number(ym[1]);
        installments.push({
          label: `Year ${n}`,
          amount,
          periodType: "year",
          periodNumber: n,
        });
        continue;
      }
      // "Sem 2–4: ₹50,000 each" / "Sem 2-6: ₹16,250 each"
      let sm = p.match(/^Sem (\d+)[–-](\d+):/);
      if (sm) {
        for (let n = Number(sm[1]); n <= Number(sm[2]); n++) {
          installments.push({
            label: `Semester ${n}`,
            amount,
            periodType: "semester",
            periodNumber: n,
          });
        }
        continue;
      }
      sm = p.match(/^Sem(?:ester)? (\d+):/);
      if (sm) {
        installments.push({
          label: `Semester ${Number(sm[1])}`,
          amount,
          periodType: "semester",
          periodNumber: Number(sm[1]),
        });
        continue;
      }
      // "Registration ₹500 (one-time)" — covered by university components
      if (/^registration/i.test(p)) continue;
      installments.push({
        label: p.replace(/[:]?\s*₹[\d,]+.*$/, "").trim() || p,
        amount,
        periodType: "one_time",
        periodNumber: installments.length + 1,
      });
    }
    installments.sort(
      (a, z) =>
        (a.periodType === "one_time" ? 1 : 0) -
          (z.periodType === "one_time" ? 1 : 0) ||
        a.periodNumber - z.periodNumber
    );
    const hasSem = installments.some((i) => i.periodType === "semester");
    const first = installments[0];
    return {
      paymentCycle: hasSem ? "semester" : "yearly",
      installments,
      yearlyFee: null,
      courseFee: null,
      startingFee: c.sf ? c.sf.a : first?.amount ?? null,
      startingFeeUnit: c.sf
        ? c.sf.unit
        : first
          ? first.periodType === "semester"
            ? "first semester"
            : "first year"
          : null,
      extraOtherFees: [],
    };
  }

  // Fallback: single figure
  m = b.match(/₹([\d,]+)/);
  if (m) {
    const amount = num(m[1]);
    return {
      paymentCycle: "one_time",
      installments: [
        {
          label: `${c.dur} program`,
          amount,
          periodType: "one_time",
          periodNumber: 1,
        },
      ],
      yearlyFee: null,
      courseFee: null,
      startingFee: amount,
      startingFeeUnit: "one-time",
      extraOtherFees: [],
    };
  }
  return empty;
}

const splitSpecs = (spec: string) =>
  spec
    .split(/[,·]/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * The DB's course_categories are DISCIPLINES ("Business Administration",
 * "Commerce", …) shared with the admin panel — not degree keys. Degree keys
 * (MBA, BCA, …) are stored on courses.shortName for degree-level browsing.
 */
const DEGREE_TO_DISCIPLINE: Record<string, string> = {
  BBA: "Business Administration",
  MBA: "Business Administration",
  BCA: "Computer Applications",
  MCA: "Computer Applications",
  PGDCA: "Computer Applications",
  "B.Com": "Commerce",
  "M.Com": "Commerce",
  BA: "Arts & Humanities",
  MA: "Arts & Humanities",
  "B.Sc": "Science",
  "M.Sc": "Science",
  "B.Lib": "Library Science",
  "M.Lib": "Library Science",
  MSW: "Social Work",
};

// ---------------------------------------------------------------------------
// seed
// ---------------------------------------------------------------------------
async function main() {
  const { url, target } = resolveDatabaseUrl(process.argv);
  console.log(
    `Seeding 2026 university data into ${target} database${DRY ? " (DRY RUN)" : ""}…\n`
  );
  const db = drizzle(neon(url), { schema });

  const stats = { created: 0, updated: 0, fees: 0 };

  // --- categories (disciplines) ---
  const existingCats = await db.select().from(courseCategories);
  const disciplineIds = new Map<string, string>();
  for (const discipline of new Set(Object.values(DEGREE_TO_DISCIPLINE))) {
    const found = existingCats.find(
      (e) => e.name.toLowerCase() === discipline.toLowerCase()
    );
    if (found) {
      disciplineIds.set(discipline, found.id);
    } else if (DRY) {
      console.log(`[dry] create category ${discipline}`);
      disciplineIds.set(discipline, `dry-${slugify(discipline)}`);
    } else {
      const [row] = await db
        .insert(courseCategories)
        .values({ name: discipline, slug: slugify(discipline) })
        .returning({ id: courseCategories.id });
      disciplineIds.set(discipline, row.id);
      stats.created++;
      console.log(`+ category ${discipline}`);
    }
  }
  const catIdForDegree = (key: string) => {
    const id = disciplineIds.get(DEGREE_TO_DISCIPLINE[key] ?? "");
    return id && !id.startsWith("dry-") ? id : undefined;
  };
  const catByKey = new Map(CATS.map((c) => [c.key, c]));

  // --- universities + courses ---
  const existingUnis = await db.select().from(universities);
  const seededUniIds = new Set<string>();
  const seededCourseIds = new Set<string>();

  for (const uni of DATA) {
    const uniSlug = slugify(uni.name);
    const found = existingUnis.find(
      (e) =>
        (uni.matchSlug && e.slug === uni.matchSlug) ||
        e.slug === uniSlug ||
        e.name.toLowerCase() === uni.name.toLowerCase()
    );
    if (uni.matchSlug && !found) {
      console.warn(
        `! expected existing university ${uni.matchSlug} not found — will create ${uniSlug}`
      );
    }

    const prevHighlights = (found?.highlights ?? {}) as Record<string, unknown>;
    const uniValues = {
      name: uni.name,
      shortName: uni.short,
      slug: found?.slug ?? uniSlug,
      city: uni.city,
      state: uni.state,
      country: "India",
      isActive: true,
      highlights: {
        ...prevHighlights,
        accreditation: uni.acc,
        mode: uni.mode,
        features: uni.feats,
        feeNote: uni.note,
        brandColor: uni.color,
        brandColor2: uni.color2,
      },
      updatedAt: new Date(),
    };

    let uniId: string;
    if (found) {
      uniId = found.id;
      if (!DRY) await db.update(universities).set(uniValues).where(eq(universities.id, uniId));
      stats.updated++;
      console.log(`~ university ${uni.name}`);
    } else if (DRY) {
      console.log(`[dry] create university ${uni.name} (${uniSlug})`);
      uniId = `dry-${uniSlug}`;
    } else {
      const [row] = await db
        .insert(universities)
        .values({ ...uniValues, code: uni.id })
        .returning({ id: universities.id });
      uniId = row.id;
      stats.created++;
      console.log(`+ university ${uni.name}`);
    }
    seededUniIds.add(uniId);

    const existingCourses = uniId.startsWith("dry-")
      ? []
      : await db.select().from(courses).where(eq(courses.universityId, uniId));

    for (const c of uni.courses) {
      const cat = catByKey.get(c.cat);
      const parsed = parseBreakdown(c);
      const years = parseYears(c.dur);
      const modeLc = uni.mode.toLowerCase();

      const foundCourse = existingCourses.find(
        (e) =>
          (c.dbSlug && e.slug === c.dbSlug) ||
          e.slug === `${uni.coursePrefix}-${slugify(c.name)}` ||
          e.name.toLowerCase() === c.name.toLowerCase()
      );
      if (c.dbSlug && !foundCourse && existingCourses.length) {
        console.warn(`  ! expected course ${c.dbSlug} not found — creating new`);
      }
      // keep existing slugs stable; new courses follow the DB's uni-prefix convention
      const courseSlug =
        foundCourse?.slug ?? `${uni.coursePrefix}-${slugify(c.name)}`;

      const courseValues = {
        universityId: uniId,
        categoryId: catIdForDegree(c.cat),
        name: c.name,
        shortName: c.cat,
        slug: courseSlug,
        courseType: cat?.lvl ?? null,
        deliveryMode: uni.mode,
        durationYears: String(years),
        totalSemesters: years * 2,
        eligibility: cat?.elig ?? null,
        specializations: splitSpecs(c.spec),
        isOnline: modeLc.includes("online"),
        isDistance: modeLc.includes("odl") || modeLc.includes("distance"),
        updatedAt: new Date(),
      };

      let courseId: string;
      if (foundCourse) {
        courseId = foundCourse.id;
        if (DRY) {
          if (foundCourse.name !== c.name)
            console.log(
              `  [dry] update "${foundCourse.name}" -> "${c.name}" (${foundCourse.slug})`
            );
        } else {
          await db.update(courses).set(courseValues).where(eq(courses.id, courseId));
        }
        stats.updated++;
      } else if (DRY) {
        console.log(`  [dry] create course ${c.name}`);
        continue;
      } else {
        const [row] = await db
          .insert(courses)
          .values(courseValues)
          .returning({ id: courses.id });
        courseId = row.id;
        stats.created++;
      }
      seededCourseIds.add(courseId);

      // --- fee structure (replace) ---
      const uf = uni.fees ?? {};
      const otherFees: OtherFee[] = [
        ...(uf.otherFees ?? []),
        ...parsed.extraOtherFees,
      ];
      const feeValues = {
        courseId,
        registrationFee: String(uf.registrationFee ?? 0),
        admissionFee: "0",
        processingFee: String(uf.processingFee ?? 0),
        examFee: String(uf.examFee ?? 0),
        certificateFee: "0",
        courseFee: parsed.courseFee != null ? String(parsed.courseFee) : "0",
        yearlyFee: parsed.yearlyFee != null ? String(parsed.yearlyFee) : null,
        totalFee: c.total != null ? String(c.total) : null,
        offerFee: null,
        paymentCycle: parsed.paymentCycle,
        feeOnRequest: c.total == null,
        startingFee:
          parsed.startingFee != null ? String(parsed.startingFee) : null,
        startingFeeUnit: parsed.startingFeeUnit,
        otherFees: otherFees.length ? otherFees : null,
        feeNote: uni.note,
        currency: "INR",
        emiAvailable: uf.emiAvailable ?? false,
        updatedAt: new Date(),
      };

      if (!DRY) {
        const [existingFee] = await db
          .select({ id: courseFeeStructures.id })
          .from(courseFeeStructures)
          .where(eq(courseFeeStructures.courseId, courseId))
          .limit(1);
        let feeId: string;
        if (existingFee) {
          feeId = existingFee.id;
          await db
            .update(courseFeeStructures)
            .set(feeValues)
            .where(eq(courseFeeStructures.id, feeId));
        } else {
          const [row] = await db
            .insert(courseFeeStructures)
            .values(feeValues)
            .returning({ id: courseFeeStructures.id });
          feeId = row.id;
        }
        await db
          .delete(courseFeeBreakdowns)
          .where(eq(courseFeeBreakdowns.feeStructureId, feeId));
        if (parsed.installments.length) {
          await db.insert(courseFeeBreakdowns).values(
            parsed.installments.map((inst, i) => ({
              feeStructureId: feeId,
              label: inst.label,
              amount: String(inst.amount),
              periodType: inst.periodType,
              periodNumber: inst.periodNumber,
              note: inst.note ?? null,
              sortOrder: i,
            }))
          );
        }
      }
      stats.fees++;
    }
    console.log(`  ${uni.courses.length} courses processed`);
  }

  // --- report rows not covered by the seed ---
  if (!DRY) {
    const allUnis = await db
      .select({ id: universities.id, name: universities.name })
      .from(universities);
    const unmatchedUnis = allUnis.filter((u) => !seededUniIds.has(u.id));
    const allCourses = await db
      .select({
        id: courses.id,
        name: courses.name,
        universityId: courses.universityId,
      })
      .from(courses)
      .where(inArray(courses.universityId, Array.from(seededUniIds)));
    const unmatchedCourses = allCourses.filter(
      (c) => !seededCourseIds.has(c.id)
    );
    if (unmatchedUnis.length) {
      console.log(`\nUniversities in DB but NOT in seed (left untouched):`);
      unmatchedUnis.forEach((u) => console.log(`  - ${u.name}`));
    }
    if (unmatchedCourses.length) {
      const uniName = new Map(allUnis.map((u) => [u.id, u.name]));
      console.log(
        `\nCourses under seeded universities NOT in seed (left untouched):`
      );
      unmatchedCourses.forEach((c) =>
        console.log(`  - ${c.name} (${uniName.get(c.universityId ?? "")})`)
      );
    }
  }

  console.log(
    `\nDone (${target}${DRY ? ", dry" : ""}). created=${stats.created} updated=${stats.updated} feeStructures=${stats.fees}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
