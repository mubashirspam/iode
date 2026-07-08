import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCoursesByDegree, uniHighlights } from "@/lib/db/queries";
import { degreeBySlug } from "@/lib/category-meta";
import { inr, startingFeeLabel } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ "course-name": string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const degree = degreeBySlug(params["course-name"]);
  if (!degree) return { title: "Courses" };
  return {
    title: `Online ${degree.key} — Compare Fees Across Universities (2026)`,
    description: `${degree.full} (${degree.duration}, ${degree.level}) — compare online/distance ${degree.key} fees across UGC-recognized universities, cheapest first. Free admission guidance.`,
  };
}

export default async function DegreeComparisonPage(props: Props) {
  const params = await props.params;
  const degree = degreeBySlug(params["course-name"]);
  // Old hardcoded course slugs (ba-english, montessori-ttc, …) no longer exist.
  if (!degree) redirect("/courses");

  const offerings = await getCoursesByDegree(degree.key);
  const cheapest = offerings.find(
    (o) => o.fee && !o.fee.feeOnRequest && o.fee.startingFee
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F0F7FF] to-white pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <nav className="text-sm text-[#6E6E73] mb-6 flex items-center gap-2">
            <Link href="/courses" className="hover:text-[#007AFF]">
              Courses
            </Link>
            <span className="opacity-50">›</span>
            <span className="text-[#1D1D1F] font-medium">{degree.key}</span>
          </nav>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F2FF] flex items-center justify-center text-3xl shrink-0">
              {degree.icon}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] leading-tight">
                Online {degree.key}
              </h1>
              <p className="text-[#6E6E73] mt-1">{degree.full}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-white border border-[#E5E5EA] text-xs font-bold rounded-full text-[#6E6E73]">
                  ⏱️ {degree.duration}
                </span>
                <span className="px-3 py-1 bg-white border border-[#E5E5EA] text-xs font-bold rounded-full text-[#6E6E73]">
                  🎓 {degree.level}
                </span>
                {cheapest && (
                  <span className="px-3 py-1 bg-[#E8F9EF] text-[#0d9455] text-xs font-bold rounded-full">
                    from {inr(cheapest.fee!.startingFee!)}{" "}
                    {cheapest.fee!.startingFeeUnit}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 bg-[#F5F9FF] border border-[#DBE8FF] rounded-xl px-4 py-3 text-sm text-[#1D1D1F]">
            <span className="font-semibold">Eligibility:</span>{" "}
            {degree.eligibility}
          </div>
        </div>
      </section>

      {/* Comparison list */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-xl font-bold text-[#1D1D1F] mb-1">
            {offerings.length}{" "}
            {offerings.length === 1
              ? "university offers"
              : "universities offer"}{" "}
            {degree.key}
          </h2>
          <p className="text-sm text-[#6E6E73] mb-6">
            Sorted by lowest starting fee — the amount you pay to begin.
          </p>

          <div className="space-y-4">
            {offerings.map(({ course, fee, university }, idx) => {
              const h = uniHighlights(university);
              const color = h.brandColor ?? "#007AFF";
              const start = startingFeeLabel(fee ?? {});
              return (
                <Link
                  key={course.id}
                  href={`/universities/${university.slug}/${course.slug}`}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl border border-[#E5E5EA] card-hover p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ background: color }}
                    >
                      {(university.shortName ?? university.name).slice(0, 5)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors">
                          {university.name}
                        </h3>
                        {idx === 0 && start && (
                          <span className="px-2 py-0.5 bg-[#E8F9EF] text-[#0d9455] text-[0.65rem] font-bold rounded-full uppercase tracking-wide">
                            Lowest Fee
                          </span>
                        )}
                        {(h.accreditation ?? h.naac) && (
                          <span className="px-2 py-0.5 bg-[#F5F5F7] text-[#6E6E73] text-[0.65rem] font-bold rounded-full">
                            {h.accreditation ?? `NAAC ${h.naac}`}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6E6E73] mt-0.5 truncate">
                        {course.name}
                        {(course.specializations?.length ?? 0) > 0 &&
                          ` · ${course
                            .specializations!.slice(0, 4)
                            .join(", ")}${
                            course.specializations!.length > 4 ? "…" : ""
                          }`}
                      </p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                      <div className="text-right">
                        {start ? (
                          <>
                            <div className="font-bold text-[#0450c9] text-lg leading-none">
                              {start.amount}
                            </div>
                            <div className="text-[0.68rem] text-[#6E6E73] mt-1 uppercase tracking-wide">
                              starts · {start.unit}
                            </div>
                          </>
                        ) : (
                          <div className="font-bold text-[#b45309] text-sm">
                            Fee on request
                          </div>
                        )}
                      </div>
                      <span className="text-[#007AFF] font-bold text-sm whitespace-nowrap">
                        Details →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {offerings.length === 0 && (
            <p className="text-center text-[#6E6E73] py-16">
              No universities currently offer this course. Check back soon.
            </p>
          )}

          {/* Funnel CTA */}
          <div className="mt-10 text-center">
            <Link
              href={`/suggest?course=${encodeURIComponent(degree.key)}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 btn-press"
            >
              ✨ Confused? Get a free {degree.key} university suggestion in 1
              minute
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
