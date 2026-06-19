'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronDown, Clock, GraduationCap, Building2, ArrowRight, X } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CourseSummary {
  id: string;
  name: string;
  shortName: string | null;
  slug: string | null;
  courseType: string | null;
  deliveryMode: string | null;
  durationYears: string | null;
  bannerImage: string | null;
  description: string | null;
  isOnline: boolean | null;
  isDistance: boolean | null;
  universityId: string | null;
  universityName: string | null;
  universitySlug: string | null;
  categoryName: string | null;
  totalFee: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  UG: 'bg-[#EEF2FF] text-[#4F46E5]',
  PG: 'bg-[#F0EBFF] text-[#7C3AED]',
  Diploma: 'bg-[#E0F7FF] text-[#0EA5E9]',
  Certificate: 'bg-[#E8FAF0] text-[#10B981]',
};

const UNI_GRADIENT = [
  'from-[#4F46E5] to-[#7C3AED]',
  'from-[#7C3AED] to-[#0EA5E9]',
  'from-[#6366F1] to-[#06B6D4]',
  'from-[#8B5CF6] to-[#4F46E5]',
];

function uniGradient(name: string | null): string {
  if (!name) return UNI_GRADIENT[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return UNI_GRADIENT[Math.abs(h) % UNI_GRADIENT.length];
}

function formatDuration(years: string | null): string {
  if (!years) return '—';
  const n = parseFloat(years);
  if (isNaN(n)) return years;
  return n === 1 ? '1 Year' : `${n} Years`;
}

// ── Reusable select ───────────────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  children,
  icon,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9381FF]">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-[#E5E0F7] bg-white py-3 pl-10 pr-9 text-sm font-medium text-[#1D1D1F] transition-colors focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEAEB2]" />
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  courses: CourseSummary[];
  initialQuery?: string;
}

export function CoursesDashboard({ courses, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [university, setUniversity] = useState('All'); // universityId
  const [courseType, setCourseType] = useState('All');

  // Mirror the header's hide-on-scroll-down logic so the sticky filter bar rises
  // to the top when the navbar hides, and drops back below it on scroll up.
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 140 && y > lastY.current) setHeaderHidden(true);
      else if (y < lastY.current) setHeaderHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Unique universities present in the catalog (for the dropdown).
  const universities = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => {
      if (c.universityId && c.universityName) map.set(c.universityId, c.universityName);
    });
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [courses]);

  // Course types (UG, PG, …) present in the catalog.
  const courseTypes = useMemo(() => {
    const seen = new Set<string>();
    courses.forEach((c) => { if (c.courseType) seen.add(c.courseType); });
    const order = ['UG', 'PG', 'Diploma', 'Certificate'];
    const sorted = order.filter((x) => seen.has(x));
    seen.forEach((x) => { if (!order.includes(x)) sorted.push(x); });
    return sorted;
  }, [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.universityName ?? '').toLowerCase().includes(q);
      const matchesUni = university === 'All' || c.universityId === university;
      const matchesType = courseType === 'All' || c.courseType === courseType;
      return matchesQuery && matchesUni && matchesType;
    });
  }, [query, university, courseType, courses]);

  const hasFilters = query !== '' || university !== 'All' || courseType !== 'All';
  const clearAll = () => { setQuery(''); setUniversity('All'); setCourseType('All'); };

  return (
    <div>
      {/* ── Search + Filters (sticks below the header, rises to top when it hides) ── */}
      <div
        style={{ top: headerHidden ? 8 : 84 }}
        className="sticky z-40 border-y border-[#ECE9FB] bg-white/85 py-3.5 backdrop-blur-xl transition-[top] duration-300 ease-out"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#AEAEB2]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search course or university…"
                className="w-full rounded-xl border border-[#E5E0F7] bg-white py-3 pl-11 pr-4 text-sm text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:border-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-3 lg:flex lg:shrink-0">
              <FilterSelect
                value={university}
                onChange={setUniversity}
                icon={<Building2 className="h-4 w-4" />}
                className="lg:w-56"
              >
                <option value="All">All Universities</option>
                {universities.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </FilterSelect>

              <FilterSelect
                value={courseType}
                onChange={setCourseType}
                icon={<GraduationCap className="h-4 w-4" />}
                className="lg:w-44"
              >
                <option value="All">All Programs</option>
                {courseTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </FilterSelect>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-[#6E6E73]">
            Showing <span className="font-semibold text-[#1D1D1F]">{filtered.length}</span> of{' '}
            <span className="font-semibold text-[#1D1D1F]">{courses.length}</span> programs
          </p>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#7C3AED] hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F3FF]">
              <Search className="h-8 w-8 text-[#9381FF]" />
            </div>
            <p className="mb-2 text-lg font-semibold text-[#1D1D1F]">No programs found</p>
            <p className="text-[#6E6E73]">Try a different search or clear the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {filtered.map((course) => {
              const href =
                course.universitySlug && course.slug
                  ? `/universities/${course.universitySlug}/${course.slug}`
                  : '#';

              return (
                <Link
                  href={href}
                  key={course.id}
                  className="university-card group flex flex-col overflow-hidden rounded-2xl border border-[#ECE9FB] bg-white shadow-[0_1px_3px_rgba(79,70,229,0.06)] transition-colors hover:border-[#C4B5FD]"
                >
                  {/* ── Image (16:9) ── */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#F5F3FF]">
                    {course.bannerImage ? (
                      <Image
                        src={course.bannerImage}
                        alt={course.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${uniGradient(course.universityName)}`}>
                        <span className="text-4xl font-bold text-white/90">
                          {course.universityName?.split(' ').map((w) => w[0]).slice(0, 2).join('') ?? '??'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a3e]/45 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {course.courseType && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${CATEGORY_COLORS[course.courseType] ?? 'bg-white/90 text-[#6E6E73]'}`}>
                          {course.courseType}
                        </span>
                      )}
                    </div>
                    {course.deliveryMode && (
                      <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#4F46E5] shadow-sm ring-1 ring-white/60 backdrop-blur-sm">
                        {course.deliveryMode}
                      </span>
                    )}
                  </div>

                  {/* ── Body ── */}
                  <div className="flex flex-1 flex-col p-3.5 sm:p-5">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1D1D1F] transition-colors group-hover:text-[#4F46E5] sm:text-base">
                      {course.name}
                    </h3>

                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6E6E73] sm:text-sm">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-[#A78BFA]" />
                      <span className="truncate">{course.universityName ?? '—'}</span>
                    </p>

                    {course.durationYears && (
                      <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#F6F4FF] px-2 py-1 text-[11px] font-medium text-[#5B21B6] sm:mt-3 sm:px-2.5 sm:text-xs">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        {formatDuration(course.durationYears)}
                      </span>
                    )}

                    {/* Footer */}
                    <div className="mt-auto border-t border-[#F1EEFC] pt-3 sm:pt-4">
                      <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F6F4FF] py-2.5 text-xs font-bold text-[#4F46E5] transition-colors group-hover:bg-gradient-to-r group-hover:from-[#4F46E5] group-hover:to-[#7C3AED] group-hover:text-white sm:text-sm">
                        View Details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
