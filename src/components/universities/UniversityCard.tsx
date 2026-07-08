import Link from "next/link";
import Image from "next/image";
import { inr } from "@/lib/format";
import {
  uniStartingFee,
  uniDegreeKeys,
  uniHighlights,
  type UniversityWithCourses,
} from "@/lib/db/queries";

export default function UniversityCard({
  university: u,
}: {
  university: NonNullable<UniversityWithCourses>;
}) {
  const h = uniHighlights(u);
  const start = uniStartingFee(u);
  const degrees = uniDegreeKeys(u);
  const color = h.brandColor ?? "#007AFF";
  const color2 = h.brandColor2 ?? "#5AC8FA";

  return (
    <Link href={`/universities/${u.slug}`} className="block group h-full">
      <div className="bg-white rounded-2xl border border-[#E5E5EA] card-hover h-full overflow-hidden flex flex-col">
        {/* Banner */}
        <div
          className="h-24 relative"
          style={{
            background: u.bannerImage
              ? undefined
              : `linear-gradient(135deg, ${color}, ${color2})`,
          }}
        >
          {u.bannerImage && (
            <Image
              src={u.bannerImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        <div className="p-5 pt-0 flex flex-col gap-3 flex-1">
          {/* Logo overlapping banner */}
          <div className="-mt-7 flex items-end gap-3">
            <div
              className="w-14 h-14 rounded-xl border-[3px] border-white shadow-md flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden relative"
              style={{ background: color }}
            >
              {u.logoUrl ? (
                <Image
                  src={u.logoUrl}
                  alt={`${u.name} logo`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                (u.shortName ?? u.name).slice(0, 5)
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[1.05rem] leading-snug text-[#1D1D1F] group-hover:text-[#007AFF] transition-colors">
              {u.name}
            </h3>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              📍 {[u.city, u.state].filter(Boolean).join(", ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {h.mode && (
              <span className="px-2.5 py-0.5 bg-[#E8F2FF] text-[#007AFF] text-[0.7rem] font-bold rounded-full uppercase tracking-wide">
                {h.mode}
              </span>
            )}
            {(h.accreditation ?? h.naac) && (
              <span className="px-2.5 py-0.5 bg-[#E8F9EF] text-[#0d9455] text-[0.7rem] font-bold rounded-full">
                ✓ {h.accreditation ?? `NAAC ${h.naac}`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#F5F9FF] border border-[#E3EDFF] rounded-xl px-3 py-2 text-center">
              <div className="font-bold text-[#0450c9]">{u.courses.length}</div>
              <div className="text-[0.65rem] text-[#6E6E73] uppercase tracking-wide">
                Programs
              </div>
            </div>
            <div className="bg-[#F5F9FF] border border-[#E3EDFF] rounded-xl px-3 py-2 text-center">
              {start ? (
                <>
                  <div className="font-bold text-[#0450c9]">
                    from {inr(start.amount)}
                  </div>
                  <div className="text-[0.65rem] text-[#6E6E73] uppercase tracking-wide">
                    {start.unit}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-bold text-[#0450c9] text-sm leading-6">
                    On Request
                  </div>
                  <div className="text-[0.65rem] text-[#6E6E73] uppercase tracking-wide">
                    Fees
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {degrees.slice(0, 6).map((d) => (
              <span
                key={d}
                className="px-2 py-0.5 bg-[#F5F5F7] border border-[#E5E5EA] text-[#6E6E73] text-[0.7rem] font-semibold rounded-full"
              >
                {d}
              </span>
            ))}
            {degrees.length > 6 && (
              <span className="px-2 py-0.5 text-[#AEAEB2] text-[0.7rem] font-semibold">
                +{degrees.length - 6} more
              </span>
            )}
          </div>

          <div className="mt-auto pt-2 text-[#007AFF] font-semibold text-sm flex items-center gap-2">
            Explore University
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
          </div>
        </div>
      </div>
    </Link>
  );
}
