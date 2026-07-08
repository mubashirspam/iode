<<<<<<< HEAD
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ChevronRight,
  Award,
  CalendarDays,
  ShieldCheck,
  Users,
  BadgeCheck,
  Building2,
  Globe,
  GraduationCap,
} from "lucide-react";
import { getUniversityBySlug, getUniversities } from "@/lib/db/queries";

type UniversityHighlights = {
  naac?: string;
  established?: string;
  approvals?: string;
  students?: string;
  accreditation?: string;
  admissionOpen?: boolean;
};
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/Markdown";
import { universityLd, breadcrumbLd } from "@/lib/seo/jsonld";
import { absoluteUrl } from "@/lib/seo/site";
import EnquiryForm from "@/components/EnquiryForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import EntityView from "@/components/EntityView";

export const revalidate = 3600;

export async function generateStaticParams() {
  const unis = await getUniversities();
  return unis.filter((u) => u.slug).map((u) => ({ slug: u.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) return {};
  const canonical = `/universities/${slug}`;
  return {
    title: `${uni.name} — Online Courses, Fees & Admission`,
    description: `Explore ${uni.name} online and distance education programs. Get course details, fee structure, eligibility and apply through Vidyavasal.`,
    alternates: { canonical },
    openGraph: {
      title: `${uni.name} — Online Education | Vidyavasal`,
      description: `Explore courses and fees at ${uni.name}.`,
      url: absoluteUrl(canonical),
      images: uni.bannerImage ? [{ url: uni.bannerImage }] : [],
    },
  };
}

const HIGHLIGHT_META: Record<
  keyof UniversityHighlights,
  { label: string; Icon: typeof Award; color: string; bg: string }
> = {
  naac: { label: "NAAC Grade", Icon: Award, color: "#7C3AED", bg: "#F0EBFF" },
  established: { label: "Established", Icon: CalendarDays, color: "#0EA5E9", bg: "#E0F7FF" },
  approvals: { label: "Approvals", Icon: ShieldCheck, color: "#10B981", bg: "#E8FAF0" },
  students: { label: "Students", Icon: Users, color: "#F59E0B", bg: "#FFF7E6" },
  accreditation: { label: "Accreditation", Icon: BadgeCheck, color: "#EC4899", bg: "#FCE7F3" },
  admissionOpen: { label: "", Icon: BadgeCheck, color: "", bg: "" },
};

export default async function UniversityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);
  if (!uni) notFound();

  const highlights = (uni.highlights as UniversityHighlights) ?? {};
  const highlightItems = (
    ["naac", "established", "approvals", "students", "accreditation"] as const
  )
    .map((key) => ({ key, value: highlights[key] as string | undefined }))
    .filter((h) => h.value);

  const location = [uni.city, uni.state].filter(Boolean).join(", ");

  return (
    <>
      <JsonLd
        data={[
          universityLd({
            name: uni.name,
            slug: uni.slug,
            description: uni.content,
            logoUrl: uni.logoUrl,
            website: uni.website,
            city: uni.city,
            state: uni.state,
            universityType: uni.universityType,
            highlights: uni.highlights,
            courses: uni.courses.map((c) => ({ name: c.name, slug: c.slug })),
          }),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Universities", path: "/universities" },
            { name: uni.name, path: `/universities/${slug}` },
          ]),
        ]}
      />
      <EntityView event="view_university" entityType="university" entityId={uni.id} />

      {/* ══════════════════════ HERO (light, minimal) ══════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[#F5F5F7]">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-[#8A8A94]">
            <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/universities" className="transition-colors hover:text-[var(--accent)]">Universities</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate font-medium text-[#5B5B66]">{uni.shortName ?? uni.name}</span>
          </nav>

          {/* Identity row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
              {uni.logoUrl ? (
                <Image
                  src={uni.logoUrl}
                  alt={`${uni.name} logo`}
                  width={96}
                  height={96}
                  className="h-full w-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-extrabold text-[var(--accent)]">
                  {uni.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {uni.universityType && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[#5B5B66]">
                    <Building2 className="h-3 w-3 text-[var(--accent)]" />
                    {uni.universityType}
                  </span>
                )}
                {highlights.admissionOpen && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#067647] ring-1 ring-[#ABEFC6]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    </span>
                    Admissions Open
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-[#15151A] sm:text-3xl md:text-4xl">
                {uni.name}
              </h1>
              {location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#8A8A94]">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {location}
                </p>
              )}
            </div>
          </div>

          {/* Highlights */}
          {highlightItems.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
              {highlightItems.map(({ key, value }) => {
                const meta = HIGHLIGHT_META[key];
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-white px-3.5 py-2.5"
                  >
                    <span className="icon-tile flex h-9 w-9 shrink-0 items-center justify-center">
                      <meta.Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-[#8A8A94]">
                        {meta.label}
                      </p>
                      <p className="truncate text-sm font-bold text-[#15151A]">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════ CONTENT + SIDEBAR ══════════════════════ */}
      <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-6xl mb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Article */}
          <div className="lg:col-span-2">
            <div className="card-minimal p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="icon-tile flex h-9 w-9 items-center justify-center">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-bold text-[#15151A]">
                  About {uni.shortName ?? uni.name}
                </h2>
              </div>

              {uni.content ? (
                <Markdown>{uni.content}</Markdown>
              ) : (
                <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-2)] p-10 text-center">
                  <p className="text-sm text-[#8A8A94]">Detailed brochure coming soon.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Enquiry */}
            <div className="card-minimal overflow-hidden">
              <div className="border-b border-[var(--line)] bg-[var(--accent-soft)] px-5 py-4">
                <h3 className="text-base font-bold text-[#15151A]">Get Free Counselling</h3>
                <p className="mt-0.5 text-xs text-[#5B5B66]">
                  Talk to our experts about {uni.shortName ?? uni.name} admissions.
                </p>
              </div>
              <div className="p-5">
                <EnquiryForm
                  source="university_enquiry"
                  universityId={uni.id}
                  context={uni.name}
                  compact
                />
                <div className="mt-2">
                  <WhatsAppButton context={`admissions at ${uni.name}`} />
                </div>
              </div>
            </div>

            {/* Quick info */}
            {(uni.website || uni.state || uni.universityType) && (
              <div className="card-minimal p-5">
                <h4 className="mb-3 text-sm font-bold text-[#15151A]">University Info</h4>
                <dl className="space-y-2.5 text-sm">
                  {uni.universityType && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <dt className="w-16 shrink-0 text-[#8A8A94]">Type</dt>
                      <dd className="text-[#5B5B66]">{uni.universityType}</dd>
                    </div>
                  )}
                  {uni.state && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <dt className="w-16 shrink-0 text-[#8A8A94]">State</dt>
                      <dd className="text-[#5B5B66]">{uni.state}</dd>
                    </div>
                  )}
                  {uni.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <dt className="w-16 shrink-0 text-[#8A8A94]">Website</dt>
                      <dd className="min-w-0">
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate font-medium text-[var(--accent)] hover:underline"
                        >
                          {uni.website.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* ══════════════════════ GALLERY ══════════════════════ */}
      {uni.galleryImages && uni.galleryImages.length > 0 && (
        <div className="container mx-auto mb-16 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="mb-5 text-lg font-bold text-[#15151A]">Campus Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {uni.galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-2)]">
                <Image
                  src={url}
                  alt={`${uni.name} gallery ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════ COURSES ══════════════════════ */}
      {uni.courses.length > 0 && (
        <div className="container mx-auto mb-20 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-lg font-bold text-[#15151A] sm:text-xl">
              Courses at {uni.shortName ?? uni.name}
            </h2>
            <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
              {uni.courses.length} programs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {uni.courses.map((course) => (
              <Link
                key={course.id}
                href={`/universities/${uni.slug}/${course.slug}`}
                className="university-card group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition-all hover:border-[#DCDCE6] hover:shadow-[0_6px_24px_rgba(20,20,30,0.06)]"
              >
                {course.bannerImage && (
                  <div className="relative aspect-video overflow-hidden bg-[var(--surface-2)]">
                    <Image
                      src={course.bannerImage}
                      alt={course.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold leading-snug text-[#15151A] transition-colors group-hover:text-[var(--accent)]">
                      {course.name}
                    </h3>
                    {course.courseType && (
                      <span className="shrink-0 rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--accent)]">
                        {course.courseType}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-3">
                    <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-soft)] py-2 text-xs font-bold text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                      View Course →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
=======
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
>>>>>>> feat/university-course-experience
  );
}
