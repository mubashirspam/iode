/**
 * Deletes the leftover duplicate course rows that the 2026 seed consolidated
 * (e.g. MUJ's spec-crammed variants, MZU's per-specialization MBA rows). The
 * seed intentionally never deletes; this script removes the known duplicates
 * after verifying nothing references them (students, leads, tracker leads).
 *
 * Usage:
 *   npx tsx scripts/cleanup-duplicate-courses.ts           # staging, dry run
 *   npx tsx scripts/cleanup-duplicate-courses.ts --apply   # staging, delete
 *   npx tsx scripts/cleanup-duplicate-courses.ts --prod --apply
 */
import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "./env";

const APPLY = process.argv.includes("--apply");

// Slugs of rows superseded by the consolidated seed courses.
const DUPLICATE_SLUGS = [
  // Manipal University Jaipur — plain rows kept, verbose/exam-fee variants dropped
  "manipal-jaipur-bba-hrm-marketing-finance-accounting-enterpreneurship-management-family-business-data-analytics-retail-e-commerce-digital-marketing",
  "manipal-jaipur-b-com-digital-marketing-with-ai-e-commerce-banking-fintech-business-analytics-financial-analytics-business-accounting-taxation-accounting-with-ai-economics",
  "manipal-jaipur-bca-data-science-analytics-cloud-computing-cyber-security",
  "manipal-jaipur-mba-information-system-management-finance-hrm-bfsi-digital-marketing-marketing-analytics-data-science-it-fin-tech-operation-management-international-business-project-management-supply-chain-management-retail-management",
  "manipal-jaipur-mca-ai-ml-ai-data-science-cloud-computing-cyber-security-comprehensive-emerging-technology",
  "manipal-jaipur-ma-jmc-includes-5000-exam-fee",
  "manipal-jaipur-ma-economics-includes-5000-exam-fee",
  "manipal-jaipur-m-com-includes-5000-exam-fee",
  // Mizoram University — consolidated into MBA / MBA (Advanced Specialisations)
  "mzu-mba-big-data-analytics",
  "mzu-mba-entrepreneurship",
  "mzu-mba-marketing-management",
  // Mangalayatan — consolidated into one MA with specializations
  "mangalayatan-ma-political-science",
  "mangalayatan-ma-journalism-mass-communication",
  "mangalayatan-ma-education",
  "mangalayatan-ma-public-administration",
  // Subharti — Home Science folded into the combined MA subjects row
  "svsu-ma-home-science",
];

// courseId references that must block deletion. Tables are checked only if
// they exist in the target DB.
const REFERENCE_TABLES = [
  { table: "tracker_students", column: "course_id" },
  { table: "tracker_leads", column: "course_id" },
  { table: "tracker_student_profiles", column: "course_id" },
  { table: "leads", column: "course_id" },
];

async function main() {
  const { url, target } = resolveDatabaseUrl(process.argv);
  console.log(
    `Duplicate-course cleanup on ${target}${APPLY ? "" : " (DRY RUN — pass --apply to delete)"}\n`
  );
  const sql = neon(url);

  const rows = (await sql.query(
    `SELECT id, slug, name FROM courses WHERE slug = ANY($1)`,
    [DUPLICATE_SLUGS]
  )) as { id: string; slug: string; name: string }[];

  const found = new Set(rows.map((r) => r.slug));
  for (const s of DUPLICATE_SLUGS) {
    if (!found.has(s)) console.log(`  - not present (already clean): ${s}`);
  }
  if (!rows.length) {
    console.log("\nNothing to delete.");
    return;
  }

  const existingTables = new Set(
    (
      (await sql.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
      )) as { table_name: string }[]
    ).map((t) => t.table_name)
  );

  let deleted = 0;
  let blocked = 0;
  for (const row of rows) {
    const refs: string[] = [];
    for (const ref of REFERENCE_TABLES) {
      if (!existingTables.has(ref.table)) continue;
      const [{ n }] = (await sql.query(
        `SELECT count(*)::int AS n FROM ${ref.table} WHERE ${ref.column} = $1`,
        [row.id]
      )) as { n: number }[];
      if (n > 0) refs.push(`${ref.table}:${n}`);
    }
    if (refs.length) {
      blocked++;
      console.log(`  ! BLOCKED (referenced by ${refs.join(", ")}): ${row.name} (${row.slug})`);
      continue;
    }
    if (APPLY) {
      await sql.query(
        `DELETE FROM course_fee_breakdowns WHERE fee_structure_id IN
           (SELECT id FROM course_fee_structures WHERE course_id = $1)`,
        [row.id]
      );
      await sql.query(`DELETE FROM course_fee_structures WHERE course_id = $1`, [row.id]);
      await sql.query(`DELETE FROM courses WHERE id = $1`, [row.id]);
      console.log(`  ✓ deleted: ${row.name} (${row.slug})`);
    } else {
      console.log(`  [dry] would delete: ${row.name} (${row.slug})`);
    }
    deleted++;
  }
  console.log(
    `\nDone (${target}). ${APPLY ? "deleted" : "deletable"}=${deleted} blocked=${blocked}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
