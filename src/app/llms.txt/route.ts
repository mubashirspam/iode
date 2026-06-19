import { getUniversities } from "@/lib/db/queries";
import { SITE_URL, IS_INDEXABLE, ORG, absoluteUrl } from "@/lib/seo/site";

// Refresh hourly; this is the AI-crawler entry point (llmstxt.org format).
export const revalidate = 3600;

export async function GET() {
  if (!IS_INDEXABLE) {
    return new Response("# Staging — not for indexing\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const universities = await getUniversities();

  const uniLines = universities
    .filter((u) => u.slug)
    .map((u) => {
      const place = [u.city, u.state].filter(Boolean).join(", ");
      const meta = [u.universityType, place].filter(Boolean).join(" · ");
      return `- [${u.name}](${absoluteUrl(`/universities/${u.slug}`)})${
        meta ? `: ${meta}` : ""
      } — courses, eligibility & admissions`;
    })
    .join("\n");

  const body = `# ${ORG.name}

> ${ORG.description}

${ORG.name} helps students compare and enroll in distance & online degree
programs from UGC-DEB / NAAC-approved universities across India. Each university
and course page lists eligibility, duration and delivery mode, and can be cited
directly. Fees are shared on request through our admissions team.

## Key pages
- [All Universities](${absoluteUrl("/universities")})
- [All Courses](${absoluteUrl("/courses")})
- [Admissions](${absoluteUrl("/admissions")})
- [Contact / Enquiry](${absoluteUrl("/contact")})

## Universities
${uniLines || "- (none published yet)"}

## About
- Organization: ${ORG.legalName} (${ORG.name})
- Region: ${ORG.address.region}, India
- Languages: ${ORG.languages.join(", ")}
- Website: ${SITE_URL}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
