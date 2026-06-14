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

const PLACEHOLDER = "https://placehold.co/1200x400/1a0a3e/9381FF?text=University";

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
  const banner = uni.bannerImage || PLACEHOLDER;

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

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative">
        {/* Banner image */}
        <div className="relative h-[300px] w-full overflow-hidden sm:h-[360px] md:h-[420px]">
          <Image
            src={banner}
            alt={uni.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={!uni.bannerImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0524] via-[#1a0a3e]/70 to-[#1a0a3e]/30" />
          <div className="absolute inset-0 dot-pattern opacity-10" />
        </div>

        {/* Overlaid content */}
        <div className="container relative mx-auto -mt-44 px-4 sm:px-6 lg:px-8 max-w-6xl pb-2 sm:-mt-48">
          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <Link href="/universities" className="transition-colors hover:text-white">Universities</Link>
            <ChevronRight className="h-3.5 w-3.5 text-white/40" />
            <span className="truncate font-medium text-white">{uni.shortName ?? uni.name}</span>
          </nav>

          {/* Identity row */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Logo */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-xl sm:h-28 sm:w-28">
              {uni.logoUrl ? (
                <Image
                  src={uni.logoUrl}
                  alt={`${uni.name} logo`}
                  width={112}
                  height={112}
                  className="h-full w-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <span className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] bg-clip-text text-3xl font-extrabold text-transparent">
                  {uni.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 pb-1 text-white">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {uni.universityType && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm">
                    <Building2 className="h-3 w-3" />
                    {uni.universityType}
                  </span>
                )}
                {highlights.admissionOpen && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981] px-3 py-1 text-xs font-bold text-white shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    Admissions Open
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                {uni.name}
              </h1>
              {location && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/75">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {location}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ HIGHLIGHTS ══════════════════════ */}
      {highlightItems.length > 0 && (
        <div className="container mx-auto mt-8 px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {highlightItems.map(({ key, value }) => {
              const meta = HIGHLIGHT_META[key];
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-2xl border border-[#ECE9FB] bg-white p-3.5 shadow-[0_1px_3px_rgba(79,70,229,0.05)]"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <meta.Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#AEAEB2]">
                      {meta.label}
                    </p>
                    <p className="truncate text-sm font-bold text-[#1D1D1F]">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════ CONTENT + SIDEBAR ══════════════════════ */}
      <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8 max-w-6xl mb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Article */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#ECE9FB] bg-white p-6 shadow-[0_1px_3px_rgba(79,70,229,0.05)] sm:p-8">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <h2 className="text-lg font-extrabold text-[#1D1D1F]">
                  About {uni.shortName ?? uni.name}
                </h2>
              </div>

              {uni.content ? (
                <Markdown>{uni.content}</Markdown>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#E0DBF7] bg-[#FAF9FF] p-10 text-center">
                  <p className="text-sm text-[#9A98A3]">Detailed brochure coming soon.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Enquiry */}
            <div className="overflow-hidden rounded-3xl border border-[#ECE9FB] bg-white shadow-[0_4px_20px_rgba(79,70,229,0.08)]">
              <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-5 py-4 text-white">
                <h3 className="text-base font-bold">Get Free Counselling</h3>
                <p className="mt-0.5 text-xs text-white/80">
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
              <div className="rounded-3xl border border-[#ECE9FB] bg-white p-5 shadow-[0_1px_3px_rgba(79,70,229,0.05)]">
                <h4 className="mb-3 text-sm font-bold text-[#1D1D1F]">University Info</h4>
                <dl className="space-y-2.5 text-sm">
                  {uni.universityType && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                      <dt className="w-16 shrink-0 text-[#AEAEB2]">Type</dt>
                      <dd className="text-[#3A3A3C]">{uni.universityType}</dd>
                    </div>
                  )}
                  {uni.state && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                      <dt className="w-16 shrink-0 text-[#AEAEB2]">State</dt>
                      <dd className="text-[#3A3A3C]">{uni.state}</dd>
                    </div>
                  )}
                  {uni.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                      <dt className="w-16 shrink-0 text-[#AEAEB2]">Website</dt>
                      <dd className="min-w-0">
                        <a
                          href={uni.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate font-medium text-[#4F46E5] hover:underline"
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
          <h2 className="mb-5 text-lg font-extrabold text-[#1D1D1F]">Campus Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {uni.galleryImages.map((url, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-2xl border border-[#ECE9FB] bg-[#F5F3FF]">
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
            <h2 className="text-lg font-extrabold text-[#1D1D1F] sm:text-xl">
              Courses at {uni.shortName ?? uni.name}
            </h2>
            <span className="shrink-0 rounded-full bg-[#F6F4FF] px-3 py-1 text-xs font-semibold text-[#7C3AED]">
              {uni.courses.length} programs
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {uni.courses.map((course) => (
              <Link
                key={course.id}
                href={`/universities/${uni.slug}/${course.slug}`}
                className="university-card group flex flex-col overflow-hidden rounded-2xl border border-[#ECE9FB] bg-white shadow-[0_1px_3px_rgba(79,70,229,0.05)] transition-colors hover:border-[#C4B5FD]"
              >
                {course.bannerImage && (
                  <div className="relative aspect-video overflow-hidden bg-[#F5F3FF]">
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
                    <h3 className="text-sm font-bold leading-snug text-[#1D1D1F] transition-colors group-hover:text-[#4F46E5]">
                      {course.name}
                    </h3>
                    {course.courseType && (
                      <span className="shrink-0 rounded-md bg-[#EEF2FF] px-1.5 py-0.5 text-[10px] font-bold text-[#4F46E5]">
                        {course.courseType}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    {course.totalFee ? (
                      <span className="text-sm font-extrabold text-[#1D1D1F]">
                        ₹{Number(course.totalFee).toLocaleString("en-IN")}
                      </span>
                    ) : <span />}
                    <span className="text-xs font-bold text-[#4F46E5] group-hover:underline">
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
  );
}
