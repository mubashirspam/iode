"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Sparkles, Plus } from "lucide-react";
import type { HomeUniversity } from "@/lib/db/queries";

// Deterministic gradient palette for logo fallbacks — keyed by card index so the
// same university always gets the same colour across renders.
// On-brand logo-fallback gradients — all within the Vidyavasal indigo→purple→sky family.
const GRADIENTS = [
  "from-[#4F46E5] to-[#7C3AED]",
  "from-[#7C3AED] to-[#0EA5E9]",
  "from-[#6366F1] to-[#06B6D4]",
  "from-[#8B5CF6] to-[#4F46E5]",
];

const PLACEHOLDER = "https://placehold.co/640x360/0f172a/64748b?text=Vidyavasal";

const ROWS_STEP = 2; // reveal two rows at a time
const COLS_MOBILE = 2;
const COLS_DESKTOP = 4;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function Card({ uni, index }: { uni: HomeUniversity; index: number }) {
  const grad = GRADIENTS[index % GRADIENTS.length];
  const location = [uni.city, uni.state].filter(Boolean).join(", ");

  return (
    <Link
      href={uni.slug ? `/universities/${uni.slug}` : "/universities"}
      className="university-card group relative flex flex-col overflow-hidden rounded-2xl border border-[#ECE9FB] bg-white shadow-[0_1px_3px_rgba(79,70,229,0.06)] ring-1 ring-transparent transition-colors hover:border-[#C4B5FD]"
    >
      {/* ── Banner (19:6) ── */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={uni.bannerImage || PLACEHOLDER}
          alt={uni.name}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized={!uni.bannerImage}
        />
        {/* Brand-tinted overlay (deep indigo, matches the dark sections) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a3e]/75 via-[#1a0a3e]/15 to-transparent" />

        {/* Type badge */}
        {uni.universityType && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-[#4F46E5] shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
            {uni.universityType}
          </span>
        )}

        {/* Status badges */}
        <div className="absolute right-2.5 top-2.5 flex flex-col items-end gap-1">
          {uni.admissionOpen && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              <span className="hidden sm:inline">Admissions</span> Open
            </span>
          )}
          {uni.isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/30">
              <Sparkles className="h-2.5 w-2.5" />
              New
            </span>
          )}
        </div>
      </div>

      {/* ── Logo (overlapping) ── */}
      <div className="relative -mt-6 px-4">
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-gradient-to-br ${grad} text-sm font-bold text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)]`}
        >
          {uni.logoUrl ? (
            <Image
              src={uni.logoUrl}
              alt={`${uni.name} logo`}
              width={48}
              height={48}
              className="h-full w-full bg-white object-contain"
              unoptimized
            />
          ) : (
            initials(uni.name)
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1D1D1F] transition-colors group-hover:text-[#4F46E5]">
          {uni.name}
        </h3>

        {location && (
          <p className="mt-1 flex items-center gap-1 text-[11px] text-[#9A98A3]">
            <MapPin className="h-3 w-3 shrink-0 text-[#A78BFA]" />
            <span className="truncate">{location}</span>
          </p>
        )}

        {/* Course chips — kept within the indigo/violet brand family */}
        {uni.courseChips.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {uni.courseChips.slice(0, 2).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className={`inline-flex max-w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                  c.isNew
                    ? "bg-[#EEF2FF] text-[#4F46E5] ring-1 ring-[#4F46E5]/15"
                    : "bg-[#F6F4FF] text-[#7C3AED] ring-1 ring-[#7C3AED]/10"
                }`}
              >
                {c.isNew && (
                  <span className="rounded-sm bg-[#4F46E5] px-1 py-px text-[7px] font-bold uppercase leading-none text-white">
                    New
                  </span>
                )}
                <span className="truncate">{c.name}</span>
              </span>
            ))}
            {uni.courseCount > 2 && (
              <span className="inline-flex items-center rounded-md bg-[#F6F4FF] px-1.5 py-0.5 text-[10px] font-bold text-[#9381FF]">
                +{uni.courseCount - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-[#F1EEFC] pt-3">
          <span className="inline-flex items-center rounded-full bg-[#F6F4FF] px-2 py-0.5 text-[11px] font-semibold text-[#5B21B6]">
            {uni.courseCount} {uni.courseCount === 1 ? "course" : "courses"}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#4F46E5]">
            View
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function HomeUniversities({ data }: { data: HomeUniversity[] }) {
  // Start mobile-first (2 cols) so the SSR markup matches the first client paint;
  // bump to 5 cols on desktop after mount.
  const [cols, setCols] = useState(COLS_MOBILE);
  const [rows, setRows] = useState(ROWS_STEP);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setCols(mq.matches ? COLS_DESKTOP : COLS_MOBILE);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (data.length === 0) return null;

  const visibleCount = rows * cols;
  const visible = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {visible.map((uni, i) => (
          <Card key={uni.id} uni={uni} index={i} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => setRows((r) => r + ROWS_STEP)}
            className="group inline-flex items-center gap-2 rounded-full border border-[#E0DBF7] bg-white px-6 py-3 text-sm font-bold text-[#4F46E5] shadow-[0_2px_10px_rgba(79,70,229,0.08)] transition-all hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-[#4F46E5] hover:to-[#7C3AED] hover:text-white hover:shadow-[0_8px_24px_rgba(79,70,229,0.3)]"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            Show more universities
          </button>
        </div>
      )}
    </div>
  );
}
