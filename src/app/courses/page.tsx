import { Metadata } from "next";
import Link from "next/link";
import { getDegreeGroups } from "@/lib/db/queries";
import { DEGREES } from "@/lib/category-meta";
import { inr } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online Degree Courses — Compare Fees Across Universities",
  description:
    "Browse online & distance degree courses (MBA, MCA, BBA, BCA, B.Com and more) and compare fees across UGC-recognized universities.",
};

export default async function CoursesPage() {
  const groups = await getDegreeGroups();
  const byKey = new Map(groups.map((g) => [g.key, g]));
  const degrees = DEGREES.filter((d) => byKey.has(d.key));

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F0F7FF] to-white pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <span className="section-label mb-5 inline-flex">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
            Browse by Course
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mt-3 mb-4 leading-tight">
            Online Degree <span className="gradient-text">Courses</span>
          </h1>
          <p className="text-lg text-[#6E6E73] max-w-2xl mx-auto">
            Pick a course to compare fees, specializations and universities —
            lowest fees first.
          </p>
        </div>
      </section>

      {/* Degree grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {degrees.map((d) => {
              const g = byKey.get(d.key)!;
              return (
                <Link
                  href={`/courses/${d.slug}`}
                  key={d.key}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] card-hover h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-13 h-13 min-w-13 rounded-2xl bg-[#E8F2FF] flex items-center justify-center text-2xl">
                        {d.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors">
                          {d.key}
                        </h3>
                        <p className="text-xs text-[#6E6E73]">{d.full}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2.5 py-0.5 bg-[#F5F5F7] text-[#6E6E73] text-[0.7rem] font-bold rounded-full">
                        {d.duration}
                      </span>
                      <span className="px-2.5 py-0.5 bg-[#F5F5F7] text-[#6E6E73] text-[0.7rem] font-bold rounded-full">
                        {d.level}
                      </span>
                    </div>
                    <div className="mt-auto pt-3 border-t border-dashed border-[#E5E5EA] flex items-end justify-between">
                      <div>
                        {g.minStartingFee != null ? (
                          <>
                            <div className="font-bold text-[#0450c9]">
                              from {inr(g.minStartingFee)}
                            </div>
                            <div className="text-[0.68rem] text-[#6E6E73] uppercase tracking-wide">
                              across {g.universityCount}{" "}
                              {g.universityCount === 1
                                ? "university"
                                : "universities"}
                            </div>
                          </>
                        ) : (
                          <div className="font-bold text-[#b45309] text-sm">
                            Fee on request
                          </div>
                        )}
                      </div>
                      <span className="text-[#007AFF] text-sm font-bold">
                        Compare →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Other programs */}
          <div className="mt-12 rounded-2xl bg-[#F5F5F7] p-6 md:p-8 text-center">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-2">
              Looking for our other programs?
            </h2>
            <p className="text-sm text-[#6E6E73] mb-4">
              IITS Distance Education · Eduthalim Degree/10th/12th · Montessori
              Teacher Training
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/iits"
                className="px-5 py-2.5 rounded-full bg-white border border-[#E5E5EA] text-sm font-semibold text-[#1D1D1F] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                IITS Distance
              </Link>
              <Link
                href="/eduthalim"
                className="px-5 py-2.5 rounded-full bg-white border border-[#E5E5EA] text-sm font-semibold text-[#1D1D1F] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                Eduthalim
              </Link>
              <Link
                href="/montessori"
                className="px-5 py-2.5 rounded-full bg-white border border-[#E5E5EA] text-sm font-semibold text-[#1D1D1F] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                Montessori
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
