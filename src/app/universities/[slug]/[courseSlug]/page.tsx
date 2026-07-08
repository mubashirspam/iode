import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  GraduationCap,
  Clock,
  Layers,
  MonitorPlay,
  BookOpenCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getCourseBySlug } from "@/lib/db/queries";
import JsonLd from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import Markdown from "@/components/Markdown";
import CourseFeeRequest from "@/components/CourseFeeRequest";
import EntityView from "@/components/EntityView";
import {
  courseLd,
  breadcrumbLd,
  faqLd,
  buildCourseFaq,
} from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string; courseSlug: string }> }): Promise<Metadata> {
  const { slug, courseSlug } = await params;
  const data = await getCourseBySlug(slug, courseSlug);
  if (!data) return {};
  const canonical = `/universities/${slug}/${courseSlug}`;
  return {
    title: `${data.name} — ${data.university.name} | Fees, Eligibility & Admission`,
    description: `${data.name} from ${data.university.name}: eligibility, ${data.deliveryMode ?? "distance/online"} mode, duration and admission support. Request the latest fee structure & scholarships through Vidyavasal.`,
    alternates: { canonical },
    openGraph: {
      title: `${data.name} — ${data.university.name} | Vidyavasal`,
      description: data.description ?? `Eligibility, duration & admission for ${data.name} at ${data.university.name}.`,
      url: absoluteUrl(canonical),
      images: data.bannerImage ? [{ url: data.bannerImage }] : [],
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string; courseSlug: string }> }) {
  const { slug, courseSlug } = await params;
  const data = await getCourseBySlug(slug, courseSlug);
  if (!data) notFound();

  // NOTE: fee data is fetched for SEO/JSON-LD context but is intentionally never
  // rendered on the public page — pricing is kept internal to capture leads.
  const fee = data.feeStructure;

  const courseForLd = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    content: data.content,
    courseType: data.courseType,
    deliveryMode: data.deliveryMode,
    durationYears: data.durationYears,
    isOnline: data.isOnline,
    isDistance: data.isDistance,
    eligibility: data.eligibility,
    bannerImage: data.bannerImage,
    fee,
    university: { name: data.university.name, slug: data.university.slug },
  };
  const faqItems = buildCourseFaq(courseForLd);
  const context = `${data.name} at ${data.university.name}`;

  const quickFacts = [
    data.courseType && { Icon: GraduationCap, label: "Level", value: data.courseType === "PG" ? "Postgraduate" : data.courseType === "UG" ? "Undergraduate" : data.courseType },
    data.durationYears && { Icon: Clock, label: "Duration", value: `${data.durationYears} Year${Number(data.durationYears) === 1 ? "" : "s"}` },
    data.totalSemesters && { Icon: Layers, label: "Semesters", value: String(data.totalSemesters) },
    data.deliveryMode && { Icon: MonitorPlay, label: "Mode", value: data.deliveryMode },
  ].filter(Boolean) as { Icon: typeof Clock; label: string; value: string }[];

  return (
    <>
      <JsonLd
        data={[
          courseLd(courseForLd),
          faqLd(faqItems),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Universities", path: "/universities" },
            { name: data.university.name, path: `/universities/${slug}` },
            { name: data.name, path: `/universities/${slug}/${courseSlug}` },
          ]),
        ]}
      />
      <EntityView event="view_course" entityType="course" entityId={data.id} />

      {/* ══════════════════════ HERO (light, minimal) ══════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[#F5F5F7]">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-[#8A8A94]">
            <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/universities" className="transition-colors hover:text-[var(--accent)]">Universities</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/universities/${slug}`} className="transition-colors hover:text-[var(--accent)]">{data.university.shortName ?? data.university.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-[#5B5B66]">{data.name}</span>
          </nav>

          {/* Badges */}
          <div className="mb-3.5 flex flex-wrap gap-2">
            {data.courseType && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[#5B5B66]">
                <GraduationCap className="h-3 w-3 text-[var(--accent)]" />
                {data.courseType}
              </span>
            )}
            {data.deliveryMode && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[#5B5B66]">
                <MonitorPlay className="h-3 w-3 text-[var(--accent)]" />
                {data.deliveryMode}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#067647] ring-1 ring-[#ABEFC6]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
              </span>
              Admissions Open
            </span>
          </div>

          <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight text-[#15151A] sm:text-3xl md:text-4xl">
            {data.name}
          </h1>
          <p className="mt-2 text-sm text-[#8A8A94]">
            Offered by{" "}
            <Link href={`/universities/${slug}`} className="font-semibold text-[var(--accent)] hover:underline">
              {data.university.name}
            </Link>
          </p>
          {data.description && (
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#5B5B66]">{data.description}</p>
          )}

          {/* Quick facts */}
          {quickFacts.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {quickFacts.map(({ Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5"
                >
                  <span className="icon-tile flex h-9 w-9 shrink-0 items-center justify-center">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A8A94]">{label}</p>
                    <p className="truncate text-sm font-bold text-[#15151A]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ CONTENT + SIDEBAR ══════════════════════ */}
      <div className="container mx-auto mt-10 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-6 lg:col-span-2">
            {/* Eligibility */}
            {data.eligibility && (
              <div className="rounded-3xl border border-[#FDE9C8] bg-gradient-to-br from-[#FFFBF3] to-[#FFF6E6] p-5 sm:p-6">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F59E0B] text-white">
                    <BookOpenCheck className="h-5 w-5" />
                  </span>
                  <h2 className="text-base font-bold text-[#15151A]">Eligibility Criteria</h2>
                </div>
                <p className="text-[15px] leading-relaxed text-[#7A5A1E]">{data.eligibility}</p>
              </div>
            )}

            {/* Markdown content — same polished renderer as the university page */}
            <div className="card-minimal p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-2.5">
                <span className="icon-tile flex h-9 w-9 items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-[#15151A]">Course Overview</h2>
              </div>
              {data.content ? (
                <Markdown>{data.content}</Markdown>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-10 text-center">
                  <p className="text-sm text-[#8A8A94]">Detailed course content coming soon.</p>
                </div>
              )}
            </div>

            {/* FAQ — mirrors the FAQPage JSON-LD for rich results & AI citation */}
            <FaqAccordion items={faqItems} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Fee request — pricing stays internal, this captures the lead */}
            <CourseFeeRequest
              universityId={data.university.id}
              courseId={data.id}
              context={context}
            />

            {/* University card */}
            <div className="card-minimal p-5">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8A8A94]">Offered By</h4>
              <Link
                href={`/universities/${slug}`}
                className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--surface-2)]"
              >
                <div className="icon-tile flex h-10 w-10 shrink-0 items-center justify-center text-xs font-bold">
                  {data.university.shortName?.slice(0, 2) ?? data.university.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-[#15151A]">{data.university.name}</div>
                  {data.university.state && <div className="text-xs text-[#8A8A94]">{data.university.state}</div>}
                </div>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[#8A8A94]" />
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* ══════════════════════ OTHER COURSES ══════════════════════ */}
      {data.siblingCourses.length > 0 && (
        <div className="container mx-auto mb-20 max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-lg font-bold text-[#15151A] sm:text-xl">
            Other Courses from {data.university.shortName ?? data.university.name}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.siblingCourses.map((c) => (
              <Link
                key={c.id}
                href={`/universities/${slug}/${c.slug}`}
                className="card-minimal group flex flex-col p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold leading-snug text-[#15151A] transition-colors group-hover:text-[var(--accent)]">
                    {c.name}
                  </h3>
                  {c.courseType && (
                    <span className="shrink-0 rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                      {c.courseType}
                    </span>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-[var(--accent)] group-hover:gap-1.5">
                  View Details
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
