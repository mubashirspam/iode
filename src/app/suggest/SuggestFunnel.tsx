"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { submitSuggestLead } from "@/lib/actions/leads";
import { utmFromSearchParams } from "@/lib/utm";

export type SuggestDegree = {
  key: string;
  icon: string;
  full: string;
  level: string;
  duration: string;
  specializations: string[];
  offerings: {
    universityName: string;
    universityShort: string;
    uniSlug: string;
    courseSlug: string;
    courseName: string;
    specializations: string[];
    startingFee: number | null;
    startingFeeUnit: string | null;
    totalFee: number | null;
    feeOnRequest: boolean;
    accreditation: string | null;
    brandColor: string;
  }[];
};

type Offering = SuggestDegree["offerings"][number];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

const STATUS_OPTIONS = [
  { key: "fresher", label: "Fresher", icon: "🎓", sub: "Recently finished studies" },
  { key: "working", label: "Working Professional", icon: "💼", sub: "Studying alongside my job" },
  { key: "final-year", label: "Final-year Student", icon: "📚", sub: "Planning my next step" },
];

const BUDGET_OPTIONS = [
  { key: "under-50k", label: "Under ₹50,000", min: 0, max: 50000 },
  { key: "50k-1l", label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
  { key: "1l-2l", label: "₹1,00,000 – ₹2,00,000", min: 100000, max: 200000 },
  { key: "above-2l", label: "Above ₹2,00,000 / Flexible", min: 200000, max: Infinity },
];

const ANALYZE_STEPS = [
  "Reading your preferences…",
  "Comparing 14 universities & 140+ programs…",
  "Checking fees against your budget…",
  "Preparing your personalised matches…",
];

type Step = "course" | "spec" | "status" | "budget" | "analyzing" | "results" | "done";

export default function SuggestFunnel({ degrees }: { degrees: SuggestDegree[] }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("course");
  const [degreeKey, setDegreeKey] = useState<string | null>(null);
  const [spec, setSpec] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [budgetKey, setBudgetKey] = useState<string | null>(null);
  const [analyzeIdx, setAnalyzeIdx] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preselect course from ?course= (e.g. arriving from a comparison page).
  useEffect(() => {
    const pre = searchParams.get("course");
    if (pre && degrees.some((d) => d.key.toLowerCase() === pre.toLowerCase())) {
      setDegreeKey(degrees.find((d) => d.key.toLowerCase() === pre.toLowerCase())!.key);
      setStep("spec");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const degree = degrees.find((d) => d.key === degreeKey) ?? null;
  const budget = BUDGET_OPTIONS.find((b) => b.key === budgetKey) ?? null;

  const matches = useMemo(() => {
    if (!degree) return [];
    const priced = degree.offerings.filter(
      (o) => !o.feeOnRequest && o.totalFee != null
    );
    const specMatch = (o: Offering) =>
      !spec ||
      spec === "__any__" ||
      o.specializations.some((s) =>
        s.toLowerCase().includes(spec.toLowerCase())
      );
    const inBudget = (o: Offering) =>
      !budget || (o.totalFee! >= budget.min * 0.5 && o.totalFee! <= budget.max);
    const sorted = [...priced].sort((a, b) => {
      const scoreA = (inBudget(a) ? 0 : 2) + (specMatch(a) ? 0 : 1);
      const scoreB = (inBudget(b) ? 0 : 2) + (specMatch(b) ? 0 : 1);
      if (scoreA !== scoreB) return scoreA - scoreB;
      return a.totalFee! - b.totalFee!;
    });
    const top = sorted.slice(0, 3);
    if (top.length < 3) {
      top.push(
        ...degree.offerings.filter((o) => o.feeOnRequest).slice(0, 3 - top.length)
      );
    }
    return top.map((o, i) => ({
      ...o,
      matchPct: Math.max(
        72,
        96 - i * 5 - (specMatch(o) ? 0 : 6) - (inBudget(o) ? 0 : 8)
      ),
    }));
  }, [degree, spec, budget]);

  // Analyzing animation
  useEffect(() => {
    if (step !== "analyzing") return;
    setAnalyzeIdx(0);
    const timers = ANALYZE_STEPS.map((_, i) =>
      setTimeout(() => setAnalyzeIdx(i + 1), (i + 1) * 700)
    );
    const finish = setTimeout(
      () => setStep("results"),
      ANALYZE_STEPS.length * 700 + 500
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [step]);

  const stepIndex =
    step === "course" ? 0 : step === "spec" ? 1 : step === "status" ? 2 : 3;
  const showProgress = ["course", "spec", "status", "budget"].includes(step);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitSuggestLead({
        name,
        phone,
        answers: {
          degree: degreeKey ?? undefined,
          specialization: spec === "__any__" ? "Any" : spec ?? undefined,
          status: status ?? undefined,
          budget: budget?.label,
        },
        suggestedUniversities: matches.map((m) => m.universityShort),
        utm: utmFromSearchParams(searchParams),
      });
      if (result.ok) setStep("done");
      else setError(result.error);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-[#F0F7FF] via-white to-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl py-10 md:py-16">
        {/* Heading */}
        {step !== "done" && (
          <div className="text-center mb-8">
            <span className="section-label inline-flex mb-4">
              ✨ Smart University Matcher
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-[#1D1D1F] leading-tight">
              Get Your Online University{" "}
              <span className="gradient-text">Assessment Report</span> in 1
              Minute
            </h1>
          </div>
        )}

        {/* Progress */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex justify-between text-xs font-semibold text-[#6E6E73] mb-2">
              <span>Question {stepIndex + 1} of 4</span>
              <span>{Math.round(((stepIndex + 1) / 4) * 100)}%</span>
            </div>
            <div className="h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full transition-all duration-500"
                style={{ width: `${((stepIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step: course */}
        {step === "course" && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-5 text-center">
              What course are you interested in pursuing?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {degrees.map((d) => (
                <button
                  key={d.key}
                  onClick={() => {
                    setDegreeKey(d.key);
                    setSpec(null);
                    setStep("spec");
                  }}
                  className="bg-white rounded-2xl border-2 border-[#E5E5EA] hover:border-[#007AFF] hover:bg-[#F5F9FF] transition-all p-4 text-center btn-press"
                >
                  <div className="text-2xl mb-1.5">{d.icon}</div>
                  <div className="font-bold text-[#1D1D1F] text-sm">{d.key}</div>
                  <div className="text-[0.65rem] text-[#AEAEB2] mt-0.5">
                    {d.duration} · {d.level}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: specialization */}
        {step === "spec" && degree && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-1 text-center">
              Choose a specialization for your {degree.key}
            </h2>
            <p className="text-sm text-[#6E6E73] text-center mb-5">
              Not sure yet? Pick “Any — suggest for me”.
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => {
                  setSpec("__any__");
                  setStep("status");
                }}
                className="px-4 py-2.5 rounded-full border-2 border-[#007AFF] bg-[#E8F2FF] text-[#007AFF] text-sm font-bold btn-press"
              >
                ✨ Any — suggest for me
              </button>
              {degree.specializations.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpec(s);
                    setStep("status");
                  }}
                  className="px-4 py-2.5 rounded-full border-2 border-[#E5E5EA] bg-white text-[#1D1D1F] text-sm font-semibold hover:border-[#007AFF] hover:text-[#007AFF] transition-colors btn-press"
                >
                  {s}
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep("course")} />
          </div>
        )}

        {/* Step: status */}
        {step === "status" && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-5 text-center">
              What is your current status?
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {STATUS_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => {
                    setStatus(o.label);
                    setStep("budget");
                  }}
                  className="bg-white rounded-2xl border-2 border-[#E5E5EA] hover:border-[#007AFF] hover:bg-[#F5F9FF] transition-all p-5 flex items-center gap-4 text-left btn-press"
                >
                  <span className="text-2xl">{o.icon}</span>
                  <span>
                    <span className="block font-bold text-[#1D1D1F]">
                      {o.label}
                    </span>
                    <span className="block text-xs text-[#6E6E73] mt-0.5">
                      {o.sub}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep("spec")} />
          </div>
        )}

        {/* Step: budget */}
        {step === "budget" && (
          <div className="animate-slide-up">
            <h2 className="text-lg font-bold text-[#1D1D1F] mb-1 text-center">
              What&apos;s your total budget for the program?
            </h2>
            <p className="text-sm text-[#6E6E73] text-center mb-5">
              We&apos;ll match universities whose complete fee fits your budget.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => {
                    setBudgetKey(b.key);
                    setStep("analyzing");
                  }}
                  className="bg-white rounded-2xl border-2 border-[#E5E5EA] hover:border-[#007AFF] hover:bg-[#F5F9FF] transition-all p-5 font-bold text-[#1D1D1F] btn-press"
                >
                  {b.label}
                </button>
              ))}
            </div>
            <BackButton onClick={() => setStep("status")} />
          </div>
        )}

        {/* Analyzing */}
        {step === "analyzing" && (
          <div className="animate-slide-up text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] mx-auto mb-6 flex items-center justify-center text-2xl animate-pulse-soft">
              ✨
            </div>
            <div className="space-y-3 max-w-sm mx-auto text-left">
              {ANALYZE_STEPS.map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
                    i <= analyzeIdx ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0 ${
                      i < analyzeIdx
                        ? "bg-[#E8F9EF] text-[#0d9455]"
                        : "bg-[#E8F2FF] text-[#007AFF]"
                    }`}
                  >
                    {i < analyzeIdx ? "✓" : "•"}
                  </span>
                  <span className="text-[#1D1D1F] font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results + lead form */}
        {step === "results" && degree && (
          <div className="animate-slide-up">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8F9EF] text-[#0d9455] text-xs font-bold rounded-full mb-3">
                ✓ Analysis complete
              </span>
              <h2 className="text-xl font-bold text-[#1D1D1F]">
                Your top {degree.key} matches
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {matches.map((m, i) => (
                <div
                  key={`${m.uniSlug}-${m.courseSlug}`}
                  className="bg-white rounded-2xl border border-[#E5E5EA] p-5 flex items-center gap-4 shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs shrink-0"
                    style={{ background: m.brandColor }}
                  >
                    {m.universityShort.slice(0, 5)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#1D1D1F] text-sm">
                        {m.universityName}
                      </span>
                      {i === 0 && (
                        <span className="px-2 py-0.5 bg-[#E8F2FF] text-[#007AFF] text-[0.6rem] font-bold rounded-full uppercase">
                          Best match
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6E6E73] mt-0.5 truncate">
                      {m.courseName}
                      {m.accreditation && ` · ${m.accreditation}`}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[0.65rem] font-bold text-[#0d9455]">
                      {m.matchPct}% match
                    </div>
                    {m.feeOnRequest ? (
                      <div className="text-xs font-bold text-[#b45309] mt-0.5">
                        Fee on request
                      </div>
                    ) : (
                      m.startingFee != null && (
                        <div className="text-sm font-bold text-[#0450c9] mt-0.5">
                          from {inr(m.startingFee)}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border-2 border-[#007AFF]/20 shadow-lg shadow-[#007AFF]/5 p-6">
              <h3 className="font-bold text-[#1D1D1F] text-center mb-1">
                Get your full assessment report — free
              </h3>
              <p className="text-xs text-[#6E6E73] text-center mb-5">
                Detailed fee comparison + pros &amp; cons of each match, sent on
                WhatsApp. A mentor will help you decide.
              </p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="Mobile number (WhatsApp)"
                  className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]"
                />
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2.5">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#007AFF] text-white font-semibold py-3.5 rounded-xl hover:bg-[#0066D6] disabled:opacity-60 transition-colors shadow-md shadow-[#007AFF]/20 btn-press"
                >
                  {submitting ? "Sending…" : "Send My Free Report →"}
                </button>
                <p className="text-[0.65rem] text-[#AEAEB2] text-center">
                  No spam. Our mentor calls once to walk you through the report.
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Done */}
        {step === "done" && degree && (
          <div className="animate-slide-up text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#E8F9EF] text-[#0d9455] text-3xl flex items-center justify-center mx-auto mb-5">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
              Your report is on its way!
            </h2>
            <p className="text-[#6E6E73] mb-8 max-w-md mx-auto">
              Our mentor will WhatsApp your personalised {degree.key} university
              report shortly and help you with the next steps — completely free.
            </p>
            <div className="space-y-3 max-w-sm mx-auto mb-8">
              {matches
                .filter((m) => m.uniSlug && m.courseSlug)
                .map((m) => (
                  <Link
                    key={`${m.uniSlug}-${m.courseSlug}`}
                    href={`/universities/${m.uniSlug}/${m.courseSlug}`}
                    className="block bg-white rounded-xl border border-[#E5E5EA] px-5 py-3.5 text-sm font-semibold text-[#1D1D1F] hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
                  >
                    Explore {m.universityShort} {degree.key} →
                  </Link>
                ))}
            </div>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Hi! I just requested my ${degree.key} university assessment report.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-press"
              >
                💬 Chat with us on WhatsApp now
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center mt-6">
      <button
        onClick={onClick}
        className="text-sm font-semibold text-[#6E6E73] hover:text-[#007AFF] transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
