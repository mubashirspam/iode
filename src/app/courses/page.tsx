import { Metadata } from "next";
import { CoursesDashboard } from "@/components/CoursesDashboard";
import { getCourses, getAdminStats } from "@/lib/db/queries";
import Link from "next/link";
<<<<<<< HEAD
import { Search } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { itemListLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const revalidate = 3600; // ISR: rebuild every hour

export const metadata: Metadata = {
  title: "Browse Courses & Universities | Vidyavasal",
  description:
    "Search 100+ courses across UGC-recognized universities. Filter by degree type and delivery mode to find your perfect online or distance program.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Browse Courses & Universities | Vidyavasal",
    description:
      "Find the right online or distance course from India's top universities — filter by type and mode.",
    type: "website",
  },
};

export default async function CoursesPage() {
  const [courses, stats] = await Promise.all([getCourses(), getAdminStats()]);

  return (
    <div>
      <JsonLd
        data={[
          itemListLd(
            "University Courses at Vidyavasal",
            courses
              .filter((c) => c.universitySlug && c.slug)
              .map((c) => ({
                name: `${c.name}${c.universityName ? ` — ${c.universityName}` : ""}`,
                path: `/universities/${c.universitySlug}/${c.slug}`,
              }))
          ),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Courses", path: "/courses" },
          ]),
        ]}
      />
      {/* ── Header (light, minimal) ── */}
      <section className="border-b border-[var(--line)] bg-[#F5F5F7]">
        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12 lg:px-8">
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-[#8A8A94]">
            <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
            <span>/</span>
            <span className="font-medium text-[#5B5B66]">Courses</span>
          </nav>
          <span className="eyebrow mb-4">
            <Search className="h-3.5 w-3.5" />
            Course Explorer
          </span>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#15151A] sm:text-4xl">
            Find your <span className="text-accent">perfect course</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#5B5B66] md:text-base">
            {stats.courses}+ programs from {stats.universities}+ UGC-recognized universities.
            Search and filter by university and program level to find what fits you.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              { value: `${stats.courses}+`, label: "Courses" },
              { value: `${stats.universities}+`, label: "Universities" },
              { value: "UGC", label: "Approved" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5 rounded-xl border border-[var(--line)] bg-white px-4 py-2.5">
                <span className="text-lg font-bold text-[#15151A]">{s.value}</span>
                <span className="text-xs text-[#8A8A94]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard ── */}
      <CoursesDashboard courses={courses} />

      {/* ── CTA ── */}
      <section className="section-y bg-[#F5F5F7] border-t border-[var(--line)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-[#15151A] mb-3">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-[#5B5B66] mb-6">
            Talk to our counselors — we&apos;ll match you with the perfect
            program from our full catalog.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="btn-primary btn-press px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
            >
              Get Personalized Advice
              <svg
                className="w-4 h-4 cta-arrow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <a
              href="https://wa.me/917034760995"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline btn-press px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Us
            </a>
=======
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
>>>>>>> feat/university-course-experience
          </div>
        </div>
      </section>
    </div>
  );
}
