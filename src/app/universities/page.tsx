<<<<<<< HEAD
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronRight, GraduationCap } from "lucide-react";
import { getUniversities } from "@/lib/db/queries";
import JsonLd from "@/components/JsonLd";
import { itemListLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Universities — Online & Distance Education | Vidyavasal",
  description: "Explore top universities offering online, distance and ODL degree programs in India. Compare fees, courses and apply through Vidyavasal.",
  openGraph: {
    title: "Universities — Online & Distance Education | Vidyavasal",
    description: "Explore top universities offering online and distance education programs in India.",
    type: "website",
  },
};

const PLACEHOLDER = "https://placehold.co/800x450/e8f0fe/1a56db?text=University";

export default async function UniversitiesPage() {
  const universities = await getUniversities();

  return (
    <>
      <JsonLd
        data={[
          itemListLd(
            "Universities Offering Online & Distance Education",
            universities
              .filter((u) => u.slug)
              .map((u) => ({ name: u.name, path: `/universities/${u.slug}` }))
          ),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Universities", path: "/universities" },
          ]),
        ]}
      />

      {/* ══════════════════════ HERO (light, minimal) ══════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[#F5F5F7]">
        <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-[#8A8A94]">
            <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#5B5B66]">Universities</span>
          </nav>
          <span className="eyebrow mb-4">
            <GraduationCap className="h-3.5 w-3.5" />
            UGC-Recognized Partners
          </span>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#15151A] sm:text-4xl">
            Top universities for <span className="text-accent">online &amp; distance</span> education
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5B5B66] md:text-base">
            Explore India&apos;s leading universities, compare courses and apply with end-to-end
            admission support from Vidyavasal.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { value: `${universities.length}+`, label: "Universities" },
              { value: `${universities.reduce((n, u) => n + Number(u.courseCount ?? 0), 0)}+`, label: "Courses" },
              { value: "UGC", label: "Approved" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5">
                <span className="text-lg font-bold text-[#15151A]">{s.value}</span>
                <span className="text-xs text-[#8A8A94]">{s.label}</span>
              </div>
            ))}
=======
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
>>>>>>> feat/university-course-experience
          </div>
        </div>
      </section>

      {/* Grid */}
<<<<<<< HEAD
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 section-y">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#8A8A94]">{universities.length} universities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map((uni) => (
            <Link
              key={uni.id}
              href={`/universities/${uni.slug}`}
              className="card-minimal group overflow-hidden"
            >
              {/* Banner */}
              <div className="relative aspect-video overflow-hidden bg-[var(--surface-2)]">
                <Image
                  src={uni.bannerImage || PLACEHOLDER}
                  alt={uni.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized={!uni.bannerImage}
                />
                {/* Type badge */}
                {uni.universityType && (
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-[#5B5B66] backdrop-blur-sm">
                      {uni.universityType}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h2 className="mb-1 text-base font-bold leading-snug text-[#15151A] transition-colors group-hover:text-[var(--accent)]">
                  {uni.name}
                </h2>
                {(uni.city || uni.state) && (
                  <p className="mb-3 flex items-center gap-1 text-sm text-[#8A8A94]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {[uni.city, uni.state].filter(Boolean).join(", ")}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-medium text-[var(--accent)]">
                    {uni.courseCount} Courses
                  </span>
                  <span className="text-xs font-semibold text-[var(--accent)] group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
=======
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
>>>>>>> feat/university-course-experience
  );
}
