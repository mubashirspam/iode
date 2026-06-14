import { NextRequest, NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { universities, courses } from "@/lib/db/schema";
import { trackerLeads } from "@/lib/db/tracker";

export const runtime = "nodejs";

// ─────────────────────────────────────────────────────────────────────────────
// Powers the floating lead-form widget.
//
//   GET  → university + course options for the dropdowns (cached at the edge).
//   POST → inserts the lead into the TRACKER's lead portal (`tracker_leads`,
//          shared database) so it shows up at panel → Leads with status "new".
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const [unis, crs] = await Promise.all([
    db
      .select({ id: universities.id, name: universities.name, slug: universities.slug })
      .from(universities)
      .orderBy(asc(universities.name)),
    db
      .select({
        id: courses.id,
        name: courses.name,
        slug: courses.slug,
        universityId: courses.universityId,
      })
      .from(courses)
      .orderBy(asc(courses.name)),
  ]);

  return NextResponse.json(
    { universities: unis, courses: crs },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  age?: string | number;
  sex?: string;
  programLevel?: string;
  universityId?: string;
  courseId?: string;
  source?: string;
  notes?: string;
};

const isUuid = (v?: string) =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

const SEXES = ["male", "female", "other"];
const PROGRAM_LEVELS = ["plus_one", "plus_two", "degree", "pg", "diploma", "other"];

export async function POST(req: NextRequest) {
  let body: Body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const phone = body.phone?.replace(/\s+/g, "").trim();
  if (!name) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 422 }
    );
  }
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { ok: false, error: "A valid mobile number is required." },
      { status: 422 }
    );
  }

  const ageNum = body.age ? parseInt(String(body.age), 10) : NaN;

  try {
    const [lead] = await db
      .insert(trackerLeads)
      .values({
        name,
        phone,
        email: body.email?.trim() || null,
        age: Number.isFinite(ageNum) && ageNum > 0 && ageNum < 120 ? ageNum : null,
        sex: body.sex && SEXES.includes(body.sex) ? body.sex : null,
        programLevel:
          body.programLevel && PROGRAM_LEVELS.includes(body.programLevel)
            ? body.programLevel
            : null,
        universityId: isUuid(body.universityId) ? body.universityId : null,
        courseId: isUuid(body.courseId) ? body.courseId : null,
        status: "new",
        source: body.source && body.source.length <= 60 ? body.source : "web_form",
        notes: body.notes?.trim() || null,
      })
      .returning({ id: trackerLeads.id });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not submit. Please try again." },
      { status: 500 }
    );
  }
}
