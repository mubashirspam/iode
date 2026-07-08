import { Metadata } from "next";
import Link from "next/link";
import { getUniversitiesWithCourses } from "@/lib/db/queries";
import UniversityCard from "@/components/universities/UniversityCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Online & Distance Universities | Compare Fees & Programs",
  description:
    "Compare UGC-recognized online and distance education universities — programs, accreditations and fee structures. Admission guidance included.",
};

export default async function UniversitiesPage() {
  const universities = await getUniversitiesWithCourses();
  const totalPrograms = universities.reduce((s, u) => s + u.courses.length, 0);

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
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            Admission Guide 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mt-3 mb-4 leading-tight">
            Our Partner{" "}
            <span className="gradient-text">Universities</span>
          </h1>
          <p className="text-lg text-[#6E6E73] max-w-2xl mx-auto">
            {universities.length} UGC-recognized universities · {totalPrograms}+
            online &amp; distance programs with transparent fee guidance.
          </p>
          <div className="mt-6">
            <Link
              href="/suggest"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 btn-press"
            >
              ✨ Not sure? Get a free university suggestion in 1 minute
            </Link>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {universities.map((u) => (
              <UniversityCard key={u.id} university={u} />
            ))}
          </div>
          {universities.length === 0 && (
            <p className="text-center text-[#6E6E73] py-16">
              Universities are being updated — please check back soon.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
