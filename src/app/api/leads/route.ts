import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { trackerLeads } from "@/lib/db/tracker";

export const runtime = "nodejs";

const VISITOR_COOKIE = "vv_vid";

type Body = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  source?: string;
  universityId?: string;
  courseId?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const isUuid = (v?: string) =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export async function POST(req: NextRequest) {
  let body: Body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  // Minimal validation — a phone is the one thing we genuinely need.
  const phone = body.phone?.replace(/\s+/g, "").trim();
  if (!phone || phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json(
      { ok: false, error: "A valid phone number is required." },
      { status: 422 }
    );
  }

  const visitorId = req.cookies.get(VISITOR_COOKIE)?.value;

  try {
    const name = body.name?.trim() || null;
    const source = body.source || "enquiry_form";

    const [lead] = await db
      .insert(leads)
      .values({
        name,
        phone,
        email: body.email?.trim() || null,
        message: body.message?.trim() || null,
        source,
        visitorId: isUuid(visitorId) ? visitorId : null,
        universityId: isUuid(body.universityId) ? body.universityId : null,
        courseId: isUuid(body.courseId) ? body.courseId : null,
        utmSource: body.utm_source || null,
        utmMedium: body.utm_medium || null,
        utmCampaign: body.utm_campaign || null,
      })
      .returning({ id: leads.id });

    // Mirror into the tracker portal so it shows up in the lead panel.
    await db.insert(trackerLeads).values({
      name: name || "Unknown",
      phone,
      email: body.email?.trim() || null,
      universityId: isUuid(body.universityId) ? body.universityId : null,
      courseId: isUuid(body.courseId) ? body.courseId : null,
      notes: body.message?.trim() || null,
      source: source.length <= 60 ? source : "web_form",
      status: "new",
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not submit enquiry. Please try again." },
      { status: 500 }
    );
  }
}
