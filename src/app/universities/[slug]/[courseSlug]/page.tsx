import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseDetail, uniHighlights } from "@/lib/db/queries";
import { inr } from "@/lib/format";
import FeeSection, { type FeePayload } from "@/components/courses/FeeSection";
import AdmissionCta from "@/components/courses/AdmissionCta";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string; courseSlug: string }> };

const num = (v: string | null | undefined) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) && n !== 0 ? n : null;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, courseSlug } = await props.params;
  const detail = await getCourseDetail(slug, courseSlug);
  if (!detail) return { title: "Course not found" };
  const { course, university, fee } = detail;
  const start = fee && !fee.feeOnRequest ? num(fee.startingFee) : null;
  return {
    title: `${course.name} at ${university.name} — Fees & Admission 2026`,
    description: `${course.name} (${course.deliveryMode ?? "Online"}) at ${
      university.name
    }${
      start ? `, fees starting ${inr(start)} ${fee?.startingFeeUnit}` : ""
    }. Full sem-wise/year-wise fee structure, specializations & free admission help.`,
  };
}

export default async function CourseDetailPage(props: Props) {
  const { slug, courseSlug } = await props.params;
  const detail = await getCourseDetail(slug, courseSlug);
  if (!detail) notFound();
  const { course, university, fee, breakdowns } = detail;

  const h = uniHighlights(university);
  const color = h.brandColor ?? "#0450c9";
  const color2 = h.brandColor2 ?? "#3f8bff";

  const components: FeePayload["components"] = [];
  const push = (label: string, v: string | null | undefined, suffix?: string) => {
    const n = num(v);
    if (n != null) components.push({ label, amount: n, suffix });
  };
  push("Registration Fee", fee?.registrationFee, "one-time");
  push("Admission Fee", fee?.admissionFee, "one-time");
  push("Processing Fee", fee?.processingFee, "one-time");
  push("Exam Fee", fee?.examFee);
  push("Certificate Fee", fee?.certificateFee, "one-time");
  push("University Fee", fee?.courseFee);

  const feePayload: FeePayload = {
    feeOnRequest: fee?.feeOnRequest ?? true,
    startingFee: num(fee?.startingFee),
    startingFeeUnit: fee?.startingFeeUnit ?? null,
    totalFee: num(fee?.totalFee),
    offerFee: num(fee?.offerFee),
    paymentCycle: fee?.paymentCycle ?? null,
    feeNote: fee?.feeNote ?? null,
    emiAvailable: fee?.emiAvailable ?? false,
    components,
    otherFees: (fee?.otherFees ?? []).map((o) => ({
      label: o.label,
      amount: o.amount,
      recurrence: o.recurrence,
      included: o.included,
    })),
    installments: breakdowns
      .filter((b) => b.label && num(b.amount) != null)
      .map((b) => ({
        label: b.label!,
        amount: num(b.amount)!,
        note: b.note,
      })),
  };

  const durationLabel = course.durationYears
    ? `${parseFloat(course.durationYears)} ${
        parseFloat(course.durationYears) > 1 ? "Years" : "Year"
      }`
    : null;
  const start = feePayload.feeOnRequest ? null : feePayload.startingFee;
  const ctaProps = {
    courseId: course.id,
    universityId: university.id,
    courseName: course.name,
    universityName: university.name,
  };

  return (
    <div className="pb-24 md:pb-0">
      {/* Hero */}
      <section className="pt-6 md:pt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <nav className="text-sm text-[#6E6E73] mb-4 flex items-center gap-2 flex-wrap">
            <Link href="/universities" className="hover:text-[#007AFF]">
              Universities
            </Link>
            <span className="opacity-50">›</span>
            <Link
              href={`/universities/${university.slug}`}
              className="hover:text-[#007AFF]"
            >
              {university.shortName ?? university.name}
            </Link>
            <span className="opacity-50">›</span>
            <span className="text-[#1D1D1F] font-medium">{course.name}</span>
          </nav>

          <div
            className="rounded-2xl p-7 md:p-10 text-white relative overflow-hidden shadow-xl"
            style={{ background: `linear-gradient(135deg, ${color}, ${color2})` }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.18),transparent_45%)]" />
            <div className="relative z-10">
              <Link
                href={`/universities/${university.slug}`}
                className="inline-flex items-center gap-2 bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4 hover:bg-white/25 transition-colors"
              >
                🏛️ {university.name}
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {course.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-4">
                {durationLabel && (
                  <span className="bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    ⏱️ {durationLabel}
                  </span>
                )}
                {course.courseType && (
                  <span className="bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    🎓 {course.courseType}
                  </span>
                )}
                {course.deliveryMode && (
                  <span className="bg-white/15 border border-white/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    💻 {course.deliveryMode}
                  </span>
                )}
                {start != null && (
                  <span className="bg-white text-[#0450c9] px-3.5 py-1.5 rounded-full text-xs font-bold">
                    Starts {inr(start)} {feePayload.startingFeeUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-6">
          {/* Specializations */}
          {(course.tags?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">
                Specializations
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.tags!.map((s: string, i: number) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-[#F5F9FF] border border-[#DBE8FF] text-[#0450c9] text-sm font-semibold rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fee structure (gated) */}
          <FeeSection
            fee={feePayload}
            universityFeeNote={h.feeNote}
            {...ctaProps}
          />

          {/* Mid-page CTA */}
          <AdmissionCta variant="band" {...ctaProps} />

          {/* Eligibility */}
          {course.eligibility && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-3">
                Eligibility
              </h2>
              <p className="text-sm text-[#1D1D1F] bg-[#F5F9FF] border border-[#DBE8FF] rounded-xl px-4 py-3">
                {course.eligibility}
              </p>
            </div>
          )}

          {/* Description / brochure */}
          {course.description && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-3">
                About this Program
              </h2>
              <p className="text-sm text-[#6E6E73] leading-relaxed">
                {course.description}
              </p>
            </div>
          )}

          {/* University features */}
          {(h.features?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E5EA] p-6 md:p-8">
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">
                Why {university.shortName ?? university.name}?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {h.features!.filter(Boolean).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-[#1D1D1F]"
                  >
                    <span className="w-5 h-5 rounded-md bg-[#E8F9EF] text-[#0d9455] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky mobile CTA bar */}
      <AdmissionCta variant="sticky" {...ctaProps} />
    </div>
  );
}
