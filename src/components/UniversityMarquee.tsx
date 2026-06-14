import Link from "next/link";
import Image from "next/image";
import type { MarqueeUniversity } from "@/lib/db/queries";

/**
 * Auto-scrolling strip of real partner-university logos. The list is duplicated
 * once so the CSS `marquee` animation (translateX -50%) loops seamlessly.
 */
export default function UniversityMarquee({
  universities,
}: {
  universities: MarqueeUniversity[];
}) {
  if (universities.length === 0) return null;

  // Repeat the source list until one "set" is wide enough to span the viewport,
  // otherwise a -50% loop on a short list leaves a visible gap. Then duplicate
  // that set once so the CSS marquee can scroll seamlessly.
  const base: MarqueeUniversity[] = [];
  while (base.length < 8) base.push(...universities);
  const loop = [...base, ...base];
  const half = base.length;

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {loop.map((uni, i) => {
          const inner = (
            <span className="flex h-12 items-center gap-3">
              <span className="relative h-11 w-[120px] shrink-0">
                <Image
                  src={uni.logoUrl}
                  alt={uni.name}
                  fill
                  sizes="120px"
                  className="object-contain object-center opacity-90 transition-opacity group-hover:opacity-100"
                  unoptimized
                />
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-[#6E6E73] transition-colors group-hover:text-[#4F46E5]">
                {uni.name}
              </span>
            </span>
          );

          return (
            <div
              key={i}
              aria-hidden={i >= half}
              className="mx-7 shrink-0"
            >
              {uni.slug ? (
                <Link href={`/universities/${uni.slug}`} className="group block">
                  {inner}
                </Link>
              ) : (
                <div className="group">{inner}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
