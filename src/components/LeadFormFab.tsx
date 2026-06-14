"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { GraduationCap, X, CheckCircle2, Sparkles } from "lucide-react";
import { track } from "@/lib/analytics";

// ─────────────────────────────────────────────────────────────────────────────
// Floating "Admission Enquiry" button + modal lead form, shown on every public
// page. Submits into the TRACKER's lead portal via /api/lead-form.
//
// Context-aware: on /universities/[slug] (and .../[courseSlug]) the university
// and course are preselected from the URL, so a student reading a specific
// course page only has to add their name + mobile.
// ─────────────────────────────────────────────────────────────────────────────

type Option = { id: string; name: string; slug: string | null };
type CourseOption = Option & { universityId: string | null };
type Options = { universities: Option[]; courses: CourseOption[] };

const PROGRAM_LEVELS = [
  { value: "plus_one", label: "+1" },
  { value: "plus_two", label: "+2" },
  { value: "degree", label: "Degree (UG)" },
  { value: "pg", label: "PG" },
  { value: "diploma", label: "Diploma" },
  { value: "other", label: "Other" },
];

// Hide the widget where it makes no sense.
const HIDDEN_PREFIXES = ["/admin", "/invoice", "/thank-you"];

/** Long course names blow up the <select> width — cap them. */
const truncate = (s: string, max = 42) =>
  s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;

// Options are fetched once per page load, shared across open/close cycles.
let optionsCache: Options | null = null;

const inputCls =
  "w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2.5 text-sm text-[#1D1D1F] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#9381FF] focus:border-transparent truncate";
const labelCls = "block text-xs font-semibold text-[#6E6E73] mb-1";

export default function LeadFormFab() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Options | null>(optionsCache);
  const [universityId, setUniversityId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  // Prefill university/course from the current URL once options arrive.
  const applyContext = useCallback(
    (opts: Options) => {
      const parts = pathname.split("/").filter(Boolean); // e.g. ["universities","slug","courseSlug"]
      if (parts[0] !== "universities" || !parts[1]) return;
      const uni = opts.universities.find((u) => u.slug === parts[1]);
      if (!uni) return;
      setUniversityId(uni.id);
      if (parts[2]) {
        const course = opts.courses.find(
          (c) => c.universityId === uni.id && c.slug === parts[2]
        );
        if (course) setCourseId(course.id);
      }
    },
    [pathname]
  );

  async function openModal() {
    setOpen(true);
    if (!optionsCache) {
      try {
        const res = await fetch("/api/lead-form");
        optionsCache = (await res.json()) as Options;
      } catch {
        optionsCache = { universities: [], courses: [] };
      }
    }
    setOptions(optionsCache);
    applyContext(optionsCache);
  }

  // Escape to close + lock page scroll while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const filteredCourses = useMemo(() => {
    const all = options?.courses ?? [];
    return universityId ? all.filter((c) => c.universityId === universityId) : all;
  }, [options, universityId]);

  const contextName = useMemo(() => {
    if (!options) return "";
    const course = options.courses.find((c) => c.id === courseId);
    if (course) return course.name;
    return options.universities.find((u) => u.id === universityId)?.name ?? "";
  }, [options, universityId, courseId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/lead-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          programLevel: fd.get("programLevel"),
          universityId,
          courseId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed");
      track("lead_submit", { source: "floating_form", context: contextName });
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (hidden) return null;

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={openModal}
        aria-label="Admission enquiry"
        className="fixed bottom-5 right-5 z-50 print:hidden group flex items-center gap-2.5 rounded-full pl-4 pr-5 py-3 text-white text-sm font-semibold shadow-[0_8px_30px_rgba(147,129,255,0.45)] bg-gradient-to-r from-[#9381FF] to-[#007AFF] hover:shadow-[0_8px_36px_rgba(0,122,255,0.5)] hover:scale-[1.03] active:scale-95 transition-all"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9381FF] to-[#007AFF] opacity-40 animate-ping [animation-duration:2.5s] pointer-events-none" />
        <GraduationCap className="h-5 w-5 relative" />
        <span className="relative hidden sm:inline">Admission Enquiry</span>
        <span className="relative sm:hidden">Enquire</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[70] print:hidden flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Admission enquiry form"
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#9381FF] to-[#007AFF] text-white px-6 pt-5 pb-4 rounded-t-3xl">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full bg-white/20 hover:bg-white/30 p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 text-xs font-medium text-white/80 mb-1">
                <Sparkles className="h-3.5 w-3.5" /> Free counselling · No spam
              </div>
              <h2 className="text-lg font-bold leading-snug">
                Get Admission Guidance
              </h2>
              <p className="text-xs text-white/85 mt-0.5">
                {contextName
                  ? `Enquiring about ${truncate(contextName, 60)}`
                  : "Share your details — our counsellor will call or WhatsApp you."}
              </p>
            </div>

            {status === "done" ? (
              <div className="px-6 py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-[#34C759] mx-auto mb-3" />
                <p className="font-bold text-[#1D1D1F]">Thank you! 🎉</p>
                <p className="text-sm text-[#6E6E73] mt-1">
                  We received your enquiry
                  {contextName ? ` about ${truncate(contextName, 50)}` : ""}.
                  Our admissions team will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-xl bg-[#F5F5F7] hover:bg-[#E5E5EA] px-5 py-2.5 text-sm font-semibold text-[#1D1D1F] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="px-6 py-5 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block col-span-2 sm:col-span-1">
                    <span className={labelCls}>
                      Name <span className="text-red-500">*</span>
                    </span>
                    <input name="name" required placeholder="Your name" className={inputCls} />
                  </label>
                  <label className="block col-span-2 sm:col-span-1">
                    <span className={labelCls}>
                      Mobile <span className="text-red-500">*</span>
                    </span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      pattern="[0-9+\-() ]{7,20}"
                      placeholder="Mobile number"
                      className={inputCls}
                    />
                  </label>
                  <label className="block col-span-2">
                    <span className={labelCls}>Email</span>
                    <input name="email" type="email" placeholder="Email (optional)" className={inputCls} />
                  </label>
                  <label className="block col-span-2">
                    <span className={labelCls}>Looking for</span>
                    <select name="programLevel" defaultValue="" className={inputCls}>
                      <option value="">Select…</option>
                      {PROGRAM_LEVELS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block col-span-2">
                    <span className={labelCls}>University</span>
                    <select
                      value={universityId}
                      onChange={(e) => {
                        setUniversityId(e.target.value);
                        setCourseId("");
                      }}
                      className={inputCls}
                    >
                      <option value="">
                        {options ? "Any university" : "Loading…"}
                      </option>
                      {(options?.universities ?? []).map((u) => (
                        <option key={u.id} value={u.id} title={u.name}>
                          {truncate(u.name)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block col-span-2">
                    <span className={labelCls}>Course</span>
                    <select
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      className={inputCls}
                    >
                      <option value="">
                        {options ? "Any course" : "Loading…"}
                      </option>
                      {filteredCourses.map((c) => (
                        <option key={c.id} value={c.id} title={c.name}>
                          {truncate(c.name)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-xl bg-gradient-to-r from-[#9381FF] to-[#007AFF] hover:opacity-95 disabled:opacity-60 text-white font-semibold text-sm py-3 transition-opacity"
                >
                  {status === "loading" ? "Submitting…" : "Request a call back"}
                </button>
                <p className="text-[11px] text-center text-[#AEAEB2]">
                  Only name & mobile are required. We respect your privacy.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
