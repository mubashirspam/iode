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
    title: `${degree.full} | Vidyavasal Courses`,
    description: `Learn more about the ${degree.full} program at Vidyavasal.`,
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
      <section className="bg-[#F5F5F7] pt-12 pb-4 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/courses" className="text-[#007AFF] hover:underline flex items-center gap-2 mb-6 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to all courses
          </Link>
          <span className="inline-block px-3 py-1 bg-[#E8F2FF] text-[#007AFF] text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Program Details
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1D1D1F]">{degree.full}</h1>
          <p className="text-lg text-[#6E6E73]">
            Advance your career with our comprehensive {degree.full} program designed for modern professionals.
          </p>
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
                      {(university.shortName ?? university.name ?? "Uni").slice(0, 5)}
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
