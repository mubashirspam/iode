/**
 * Idempotent DDL for the 2026 fee-structure upgrade.
 *
 * The public-content tables are shared with the admin dashboard (iode-tracker)
 * and are managed by hand-applied SQL rather than drizzle-kit migrations (the
 * drizzle journals in both repos are out of sync with the live DB). Every
 * statement here uses IF NOT EXISTS so the script is safe to re-run.
 *
 * Usage:
 *   npx tsx scripts/apply-fee-schema.ts           # staging (DATABASE_URL)
 *   npx tsx scripts/apply-fee-schema.ts --prod    # production (DATABASE_URL_PRODUCTION)
 */
import { neon } from "@neondatabase/serverless";
import { resolveDatabaseUrl } from "./env";

const STATEMENTS = [
  // --- course_fee_structures: payment cycle, gating, components ---
  `ALTER TABLE course_fee_structures
     ADD COLUMN IF NOT EXISTS payment_cycle varchar(20),
     ADD COLUMN IF NOT EXISTS fee_on_request boolean DEFAULT false,
     ADD COLUMN IF NOT EXISTS starting_fee numeric(10,2),
     ADD COLUMN IF NOT EXISTS starting_fee_unit varchar(30),
     ADD COLUMN IF NOT EXISTS offer_fee numeric(10,2),
     ADD COLUMN IF NOT EXISTS certificate_fee numeric(10,2) DEFAULT 0,
     ADD COLUMN IF NOT EXISTS processing_fee numeric(10,2) DEFAULT 0,
     ADD COLUMN IF NOT EXISTS other_fees jsonb,
     ADD COLUMN IF NOT EXISTS fee_note text,
     ADD COLUMN IF NOT EXISTS updated_at timestamp DEFAULT now()`,

  // --- course_fee_breakdowns: structured year/semester installments ---
  `ALTER TABLE course_fee_breakdowns
     ADD COLUMN IF NOT EXISTS period_type varchar(20),
     ADD COLUMN IF NOT EXISTS period_number integer,
     ADD COLUMN IF NOT EXISTS note varchar(255)`,

  // --- courses: specialization list ---
  `ALTER TABLE courses
     ADD COLUMN IF NOT EXISTS specializations text[]`,

  // --- leads: full UTM set for ad campaigns ---
  `ALTER TABLE leads
     ADD COLUMN IF NOT EXISTS utm_content varchar(120),
     ADD COLUMN IF NOT EXISTS utm_term varchar(120)`,

  `CREATE INDEX IF NOT EXISTS idx_course_fee_starting ON course_fee_structures (starting_fee)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_breakdown_structure ON course_fee_breakdowns (fee_structure_id)`,
];

async function main() {
  const { url, target } = resolveDatabaseUrl(process.argv);
  console.log(`Applying fee-schema DDL to ${target} database…`);
  const sql = neon(url);

  for (const stmt of STATEMENTS) {
    const firstLine = stmt.trim().split("\n")[0];
    await sql.query(stmt);
    console.log(`  ok: ${firstLine.replace(/\s+/g, " ")}`);
  }

  // Show resulting columns for a quick eyeball check.
  const cols = await sql.query(
    `SELECT table_name, column_name, data_type
       FROM information_schema.columns
      WHERE table_name IN ('course_fee_structures','course_fee_breakdowns')
      ORDER BY table_name, ordinal_position`
  );
  console.log(`\nColumns now present:`);
  for (const r of cols as {
    table_name: string;
    column_name: string;
    data_type: string;
  }[]) {
    console.log(`  ${r.table_name}.${r.column_name} (${r.data_type})`);
  }
  console.log(`\nDone (${target}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
