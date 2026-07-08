"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import {
  UTM_COOKIE,
  FEE_UNLOCK_COOKIE,
  parseUtmCookie,
  type UtmParams,
} from "@/lib/utm";

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: string;
  universityId?: string;
  courseId?: string;
  /** Explicit UTM (e.g. campaign funnel) — overrides the first-touch cookie */
  utm?: UtmParams;
};

export type LeadResult = { ok: true } | { ok: false; error: string };

const PHONE_RE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

function cleanPhone(raw: string): string | null {
  const p = raw.replace(/[\s-]/g, "");
  if (!PHONE_RE.test(p)) return null;
  return p.replace(/^\+?91/, "");
}

async function insertLead(input: LeadInput): Promise<LeadResult> {
  const name = input.name.trim().slice(0, 255);
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  const phone = cleanPhone(input.phone);
  if (!phone)
    return { ok: false, error: "Please enter a valid 10-digit mobile number." };

  const cookieStore = await cookies();
  const cookieUtm = parseUtmCookie(cookieStore.get(UTM_COOKIE)?.value);
  const utm = { ...cookieUtm, ...(input.utm ?? {}) };

  await db.insert(leads).values({
    name,
    phone,
    email: input.email?.trim().slice(0, 255) || null,
    message: input.message?.trim().slice(0, 2000) || null,
    source: input.source.slice(0, 60),
    status: "new",
    universityId: input.universityId || null,
    courseId: input.courseId || null,
    utmSource: utm.utmSource ?? null,
    utmMedium: utm.utmMedium ?? null,
    utmCampaign: utm.utmCampaign ?? null,
    utmContent: utm.utmContent ?? null,
    utmTerm: utm.utmTerm ?? null,
  });
  return { ok: true };
}

/** Fee-gate: capture the lead, then unlock fee tables site-wide via cookie. */
export async function requestFeeAccess(input: {
  name: string;
  phone: string;
  email?: string;
  universityId?: string;
  courseId?: string;
  courseName?: string;
}): Promise<LeadResult> {
  const result = await insertLead({
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.courseName
      ? `Requested full fee structure for ${input.courseName}`
      : "Requested full fee structure",
    source: "fee_request",
    universityId: input.universityId,
    courseId: input.courseId,
  });
  if (result.ok) {
    const cookieStore = await cookies();
    cookieStore.set(FEE_UNLOCK_COOKIE, "1", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }
  return result;
}

/** Admission-interest CTA on course/university pages. */
export async function requestAdmission(input: {
  name: string;
  phone: string;
  email?: string;
  universityId?: string;
  courseId?: string;
  courseName?: string;
}): Promise<LeadResult> {
  return insertLead({
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.courseName
      ? `Admission request for ${input.courseName}`
      : "Admission request",
    source: "admission_request",
    universityId: input.universityId,
    courseId: input.courseId,
  });
}

/** Campaign funnel submission with quiz answers. */
export async function submitSuggestLead(input: {
  name: string;
  phone: string;
  answers: {
    degree?: string;
    specialization?: string;
    status?: string;
    budget?: string;
  };
  suggestedUniversities?: string[];
  utm?: UtmParams;
}): Promise<LeadResult> {
  const parts = [
    input.answers.degree && `Course: ${input.answers.degree}`,
    input.answers.specialization &&
      `Specialization: ${input.answers.specialization}`,
    input.answers.status && `Status: ${input.answers.status}`,
    input.answers.budget && `Budget: ${input.answers.budget}`,
    input.suggestedUniversities?.length &&
      `Suggested: ${input.suggestedUniversities.join(", ")}`,
  ].filter(Boolean);
  return insertLead({
    name: input.name,
    phone: input.phone,
    message: `University assessment request — ${parts.join(" · ")}`,
    source: "campaign_suggest",
    utm: input.utm,
  });
}

/** Contact page form (progressive enhancement — works without JS). */
export async function submitContactForm(formData: FormData): Promise<void> {
  const result = await insertLead({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message:
      [
        formData.get("course") && `Interested in: ${formData.get("course")}`,
        formData.get("message"),
      ]
        .filter(Boolean)
        .join(" — ") || undefined,
    source: "contact_form",
  });
  // No inline error UI on the plain-HTML form; invalid input still lands the
  // user on the thank-you page but is not stored. Valid input is stored.
  if (!result.ok) console.warn("[contact] rejected lead:", result.error);
  redirect("/thank-you");
}
