import { Metadata } from "next";
import { Suspense } from "react";
import { getUniversitiesWithCourses, uniHighlights } from "@/lib/db/queries";
import { DEGREES } from "@/lib/category-meta";
import SuggestFunnel, {
  type SuggestDegree,
} from "./SuggestFunnel";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Get Your Online University Assessment Report in 1 Minute",
  description:
    "Answer 4 quick questions and our smart matcher suggests the best online universities for your course, profile and budget — free report in 1 minute.",
  robots: { index: false, follow: false },
};

const num = (v: string | null | undefined) => {
  const n = v == null ? NaN : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};

export default async function SuggestPage() {
  const universities = await getUniversitiesWithCourses();

  const degrees: SuggestDegree[] = DEGREES.map((d) => {
    const specializations = new Set<string>();
    const offerings: SuggestDegree["offerings"] = [];
    for (const u of universities) {
      const h = uniHighlights(u);
      for (const c of u.courses) {
        if ((c.shortName ?? "").toLowerCase() !== d.key.toLowerCase()) continue;
        for (const s of c.specializations ?? []) {
          if (s && s.toLowerCase() !== "general") specializations.add(s);
        }
        offerings.push({
          universityName: u.name,
          universityShort: u.shortName ?? u.name,
          uniSlug: u.slug ?? "",
          courseSlug: c.slug ?? "",
          courseName: c.name,
          specializations: c.specializations ?? [],
          startingFee: num(c.fee?.startingFee ?? null),
          startingFeeUnit: c.fee?.startingFeeUnit ?? null,
          totalFee: num(c.fee?.totalFee ?? null),
          feeOnRequest: c.fee?.feeOnRequest ?? true,
          accreditation: h.accreditation ?? (h.naac ? `NAAC ${h.naac}` : null),
          brandColor: h.brandColor ?? "#007AFF",
        });
      }
    }
    return {
      key: d.key,
      icon: d.icon,
      full: d.full,
      level: d.level,
      duration: d.duration,
      specializations: [...specializations].slice(0, 24),
      offerings,
    };
  }).filter((d) => d.offerings.length > 0);

  return (
    <Suspense>
      <SuggestFunnel degrees={degrees} />
    </Suspense>
  );
}
