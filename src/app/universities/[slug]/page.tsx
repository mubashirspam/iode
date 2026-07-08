import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getUniversityBySlug,
  uniHighlights,
  uniStartingFee,
  type CourseWithFee,
} from "@/lib/db/queries";
import { inr, startingFeeLabel } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) return { title: "University not found" };
  const start = uniStartingFee(uni);
  return {
    title: `${uni.name} — Online & Distance Courses, Fees 2026`,
    description: `${uni.name} online/distance programs${
      start ? ` with fees starting ${inr(start.amount)} ${start.unit}` : ""
    }. Compare courses, specializations and fee structure. Free admission guidance.`,
  };
}

const sortByStartingFee = (a: CourseWithFee, b: CourseWithFee) => {
  const av =
    a.fee && !a.fee.feeOnRequest && a.fee.startingFee
      ? parseFloat(a.fee.startingFee)
      : Infinity;
  const bv =
    b.fee && !b.fee.feeOnRequest && b.fee.startingFee
      ? parseFloat(b.fee.startingFee)
      : Infinity;
  return av - bv;
};

export default async function UniversityPage(props: Props) {
  const { slug } = await props.params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) notFound();

  const h = uniHighlights(uni);
  const color = h.brandColor ?? "#007AFF";
  const color2 = h.brandColor2 ?? "#5AC8FA";
  const courses = [...uni.courses].sort(sortByStartingFee);

  return (
    <div>
      {/* Hero */}
      <section className="pt-6 md:pt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <nav className="text-sm text-[#6E6E73] mb-4 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#007AFF]">
              Home
            </Link>
            <span className="opacity-50">›</span>
            <Link href="/universities" className="hover:text-[#007AFF]">
              Universities
            </Link>
            <span className="opacity-50">›</span>
            <span className="text-[#1D1D1F] font-medium">{uni.name}</span>
          </nav>

          <div className="rounded-2xl overflow-hidden border border-[#E5E5EA] shadow-sm bg-white">
            <div
              className="h-40 md:h-52 relative"
              style={{
                background: uni.bannerImage
                  ? undefined
                  : `linear-gradient(135deg, ${color}, ${color2})`,
              }}
            >
              {uni.bannerImage && (
                <Image
                  src={uni.bannerImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </div>
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <div className="flex items-end gap-4 -mt-10">
                <div
                  className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden relative"
                  style={{ background: color }}
                >
                  {uni.logoUrl ? (
                    <Image
                      src={uni.logoUrl}
                      alt={`${uni.name} logo`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    (uni.shortName ?? uni.name).slice(0, 5)
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">
                    {uni.name}
                  </h1>
                  <p className="text-sm text-[#6E6E73] mt-1">
                    📍 {[uni.city, uni.state].filter(Boolean).join(", ")}
                    {h.established && ` · Est. ${h.established}`}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {h.mode && (
                    <span className="px-3 py-1 bg-[#E8F2FF] text-[#007AFF] text-xs font-bold rounded-full uppercase tracking-wide">
                      {h.mode}
                    </span>
                  )}
                  {(h.accreditation ?? h.naac) && (
                    <span className="px-3 py-1 bg-[#E8F9EF] text-[#0d9455] text-xs font-bold rounded-full">
                      ✓ {h.accreditation ?? `NAAC ${h.naac}`}
                    </span>
                  )}
                  {h.approvals && (
                    <span className="px-3 py-1 bg-[#F5F5F7] text-[#6E6E73] text-xs font-bold rounded-full">
                      {h.approvals}
                    </span>
                  )}
                </div>
              </div>

              {(h.features?.length ?? 0) > 0 && (
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-1">
            Programs &amp; Fees
          </h2>
          <p className="text-sm text-[#6E6E73] mb-6">
            {courses.length} programs · sorted by lowest starting fee
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => {
              const start = startingFeeLabel(c.fee ?? {});
              return (
                <Link
                  key={c.id}
                  href={`/universities/${uni.slug}/${c.slug}`}
                  className="block group"
                >
                  <div
                    className="bg-white rounded-2xl p-6 border border-[#E5E5EA] card-hover h-full flex flex-col gap-3 relative overflow-hidden"
                    style={{ borderTopColor: color, borderTopWidth: 3 }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 bg-[#E8F2FF] text-[#007AFF] text-[0.7rem] font-bold rounded-full uppercase tracking-wide">
                        {c.shortName ?? c.courseType ?? "Program"}
                      </span>
                      <span className="text-xs font-semibold text-[#6E6E73]">
                        {c.durationYears
                          ? `${parseFloat(c.durationYears)} ${
                              parseFloat(c.durationYears) > 1 ? "Years" : "Year"
                            }`
                          : ""}
                      </span>
                    </div>
                    <h3 className="font-bold text-[1.02rem] text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors leading-snug">
                      {c.name}
                    </h3>
                    {(c.specializations?.length ?? 0) > 0 && (
                      <p className="text-xs text-[#6E6E73] line-clamp-2">
                        {c.specializations!.join(", ")}
                      </p>
                    )}
                    <div className="mt-auto pt-3 border-t border-dashed border-[#E5E5EA] flex items-end justify-between">
                      {start ? (
                        <div>
                          <div className="font-bold text-[#0450c9] text-lg leading-none">
                            {start.amount}
                          </div>
                          <div className="text-[0.68rem] text-[#6E6E73] mt-1 uppercase tracking-wide">
                            starts · {start.unit}
                          </div>
                        </div>
                      ) : (
                        <div className="font-bold text-[#b45309] text-sm">
                          Fee on request
                        </div>
                      )}
                      <span className="text-[#007AFF] text-sm font-bold">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
