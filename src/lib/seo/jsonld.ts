/**
 * JSON-LD builders for rich results + AI citation.
 *
 * These produce schema.org structured data so Google (rich results, AI
 * Overviews) and AI tools (ChatGPT, Claude, Perplexity) can read and cite our
 * course availability and **fee structure** with a link back.
 *
 * Keep these pure (no DB access) — pass in already-fetched data.
 */
import { SITE_URL, ORG, absoluteUrl } from "./site";

const num = (v: unknown): number | undefined => {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

// ── Site-wide ───────────────────────────────────────────────────────────────

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG.name,
    alternateName: ORG.legalName,
    url: SITE_URL,
    logo: ORG.logo,
    description: ORG.description,
    address: {
      "@type": "PostalAddress",
      addressRegion: ORG.address.region,
      addressCountry: ORG.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORG.phone,
      contactType: "admissions",
      areaServed: "IN",
      availableLanguage: ORG.languages,
    },
    sameAs: ORG.sameAs,
  };
}

export function webSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG.name,
    description: ORG.description,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ── Breadcrumbs ───────────────────────────────────────────────────────────────

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

// ── University ────────────────────────────────────────────────────────────────

type UniLd = {
  name: string;
  slug: string | null;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  city?: string | null;
  state?: string | null;
  universityType?: string | null;
  highlights?: unknown;
  courses?: { name: string; slug: string | null }[];
};

export function universityLd(uni: UniLd) {
  const url = absoluteUrl(`/universities/${uni.slug}`);
  const h = (uni.highlights ?? {}) as Record<string, unknown>;

  return {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "@id": `${url}#org`,
    name: uni.name,
    url,
    ...(uni.logoUrl ? { logo: uni.logoUrl } : {}),
    ...(uni.description ? { description: uni.description } : {}),
    ...(uni.website ? { sameAs: [uni.website] } : {}),
    address: {
      "@type": "PostalAddress",
      ...(uni.city ? { addressLocality: uni.city } : {}),
      addressRegion: uni.state ?? "India",
      addressCountry: "IN",
    },
    ...(h.naac || h.accreditation
      ? {
          hasCredential: [h.naac, h.accreditation]
            .filter(Boolean)
            .map((c) => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: String(c),
            })),
        }
      : {}),
    ...(uni.courses && uni.courses.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${uni.name} — Courses`,
            itemListElement: uni.courses
              .filter((c) => c.slug)
              .map((c) => ({
                "@type": "Course",
                name: c.name,
                url: absoluteUrl(`/universities/${uni.slug}/${c.slug}`),
              })),
          },
        }
      : {}),
  };
}

// ── Course (the fee/AI-visibility centerpiece) ───────────────────────────────

type FeeLd = {
  registrationFee?: string | null;
  admissionFee?: string | null;
  courseFee?: string | null;
  examFee?: string | null;
  yearlyFee?: string | null;
  totalFee?: string | null;
  currency?: string | null;
} | null;

type CourseLd = {
  name: string;
  slug: string | null;
  description?: string | null;
  content?: string | null;
  courseType?: string | null;
  deliveryMode?: string | null;
  durationYears?: string | number | null;
  isOnline?: boolean | null;
  isDistance?: boolean | null;
  eligibility?: string | null;
  bannerImage?: string | null;
  fee: FeeLd;
  university: { name: string; slug: string | null };
};

export function courseLd(c: CourseLd) {
  const uniUrl = absoluteUrl(`/universities/${c.university.slug}`);
  const courseUrl = absoluteUrl(`/universities/${c.university.slug}/${c.slug}`);
  const mode =
    c.isOnline || c.deliveryMode?.toLowerCase().includes("online")
      ? "online"
      : c.isDistance || c.deliveryMode?.toLowerCase().includes("distance")
      ? "blended"
      : "onsite";

  // Pricing is intentionally omitted from structured data: fees are kept
  // internal so every fee enquiry becomes a captured lead. We still emit an
  // Offer (without a price) so the course is discoverable as an available
  // program, with admission handled on request.
  const offers = {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    category: "Tuition",
    url: courseUrl,
    seller: { "@id": `${SITE_URL}/#organization` },
  };

  const duration = num(c.durationYears);

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: c.name,
    url: courseUrl,
    description:
      c.description ||
      `${c.name} offered by ${c.university.name}. View eligibility, duration, delivery mode and admission details.`,
    ...(c.bannerImage ? { image: c.bannerImage } : {}),
    provider: {
      "@type": "CollegeOrUniversity",
      name: c.university.name,
      url: uniUrl,
    },
    educationalLevel: c.courseType === "PG" ? "Postgraduate" : "Undergraduate",
    ...(c.eligibility
      ? {
          coursePrerequisites: c.eligibility,
          educationalProgramMode: mode,
        }
      : {}),
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: mode,
      ...(duration ? { courseWorkload: `P${duration}Y` } : {}),
      location: { "@type": "VirtualLocation", url: courseUrl },
      offers,
    },
    offers,
    ...(duration ? { timeToComplete: `P${duration}Y` } : {}),
    inLanguage: "en",
  };
}

// ── FAQ (what AI Overviews & Perplexity quote) ───────────────────────────────

export function faqLd(qa: { question: string; answer: string }[]) {
  if (!qa.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer },
    })),
  };
}

/** Generate course FAQ Q&A from data — used for both schema and the visible accordion. */
export function buildCourseFaq(c: CourseLd): { question: string; answer: string }[] {
  const uni = c.university.name;
  const out: { question: string; answer: string }[] = [];

  out.push({
    question: `What is the fee for ${c.name} at ${uni}?`,
    answer: `Fees for ${c.name} at ${uni} depend on the latest scholarships and EMI options available. Request the current fee structure through Vidyavasal and our admissions team will share the full breakdown along with any discounts you qualify for.`,
  });
  if (c.isOnline || c.isDistance || c.deliveryMode) {
    out.push({
      question: `Is ${c.name} available online or in distance mode?`,
      answer: `Yes. ${c.name} from ${uni} is offered in ${
        c.deliveryMode || (c.isOnline ? "online" : "distance")
      } mode, so you can study from anywhere in India.`,
    });
  }
  if (c.durationYears) {
    out.push({
      question: `What is the duration of ${c.name}?`,
      answer: `${c.name} at ${uni} has a duration of ${c.durationYears} year(s).`,
    });
  }
  if (c.eligibility) {
    out.push({
      question: `What is the eligibility for ${c.name}?`,
      answer: c.eligibility,
    });
  }
  out.push({
    question: `How do I apply for ${c.name} at ${uni}?`,
    answer: `You can apply for ${c.name} through Vidyavasal — contact our admissions team for eligibility checks, fee details and end-to-end admission support.`,
  });
  return out;
}

// ── ItemList for listing pages ───────────────────────────────────────────────

export function itemListLd(
  name: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}
