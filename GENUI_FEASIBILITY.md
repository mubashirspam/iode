# Generative UI (GenUI) Feasibility — Vidyavasal

> **Purpose:** Assess whether Generative UI (Vercel AI SDK) is worth adding to this
> project, and *where* it would actually move the needle on UX, engagement, and
> lead acquisition — grounded in the code that exists today.
>
> **Status:** Feasibility study only. No integration yet. This is a decision doc.
>
> **Date:** 2026-06-23

---

## TL;DR

**Verdict: Feasible and a strong fit — but scope it tightly.**

The single highest-value use is an **AI Admission Advisor** (chat) that streams
real, DB-backed React components (course cards, fee breakdowns, comparison
tables) and — critically — drops the *existing* lead form inline, prefilled with
the course the student was just discussing. This sits directly on top of code
that already exists (`getCourses`, `getUniversityBySlug`, the `/api/lead-form`
flow) and targets the one metric that matters here: **leads captured**.

Everything else (smart course finder, fee estimator, comparison) is the *same
machinery* exposed in different places. Build the advisor once; reuse its tools
everywhere.

**Do not** rebuild static pages as AI, replace working filters, or put an LLM
anywhere on the critical SEO/render path.

---

## What "GenUI" means here

Not "an LLM writes JSX." It means: the model **calls typed tools** you define,
those tools run your **existing Drizzle queries**, and the model **chooses which
of your pre-built React components to stream back** with that data. The UI is
always your code and your design system — the model only picks and fills it.

This matters because it removes the two scariest risks up front:
- **No hallucinated facts** — fees, eligibility, course names come from the DB via tools, never from the model's memory.
- **No hallucinated UI** — the model can only render components you shipped.

---

## Current state (what we're building on)

| Capability | Already exists? | File |
|---|---|---|
| Course data + filters (type, mode, university, fee sort) | ✅ | `src/lib/db/queries.ts` → `getCourses` |
| University + its courses | ✅ | `getUniversityBySlug` |
| Full course detail + fee structure | ✅ | `getCourseById`, `getCourseBySlug` |
| Fee breakdowns (reg/admission/exam/EMI) | ✅ | `courseFeeStructures`, `courseFeeBreakdowns` |
| Lead capture → tracker portal | ✅ | `src/components/LeadFormFab.tsx`, `src/app/api/lead-form/route.ts` |
| Lead ↔ university/course linkage | ✅ | `leads.universityId`, `leads.courseId` |
| Anonymous analytics + UTM + event tracking | ✅ | `visitors`, `pageViews`, `src/lib/analytics.ts` |
| Brand gradient `#9381FF → #007AFF` | ✅ | reused across FAB/buttons |
| **AI SDK / LLM provider** | ❌ | — not installed |

**Key insight:** the data layer for a useful advisor is *already written*. GenUI
tools would be thin wrappers around `getCourses` / `getUniversityBySlug` /
`getCourseById`. We are not building a new backend — we're giving the model a
typed door into the one we have.

---

## Where GenUI fits — ranked by value × effort

| # | Idea | UX / business value | Effort | Verdict |
|---|---|---|---|---|
| 1 | **AI Admission Advisor** (chat with streamed course cards + inline lead form) | ⭐⭐⭐⭐⭐ Direct lead gen | M | **Build first** |
| 2 | **Natural-language course finder** ("cheap online MBA under ₹1L") on `/courses` | ⭐⭐⭐⭐ Beats dropdown filters | S* | Phase 2 (reuses #1 tools) |
| 3 | **University comparison** ("compare X vs Y") → comparison table | ⭐⭐⭐⭐ High-intent moment | S* | Phase 2 |
| 4 | **Fee / EMI estimator** rendered as a component | ⭐⭐⭐ Removes price anxiety | S* | Phase 2 |
| 5 | **Eligibility checker** → checklist component | ⭐⭐⭐ Qualifies leads | S* | Phase 2 |
| 6 | **Admin: ask-your-leads** ("show conversions from Instagram last week") | ⭐⭐⭐ Internal, big with analytics tables | M | Phase 3 (optional) |

\* Small *because* they're the advisor's tools surfaced in a different entry
point — not new systems.

### ❌ Where NOT to use it
- **Static/marketing pages** (`/about`, `/montessori`, legal) — no benefit, adds cost + latency.
- **Replacing the existing `/courses` filters** — keep them; add NL search *alongside*. Filters are fast, deterministic, and SEO-friendly.
- **Server-rendered SEO content** — never put an LLM on the path that Google crawls. Course/university pages must stay static + ISR.
- **The lead form's actual submission** — keep `/api/lead-form` deterministic. The AI *opens* and *prefills* it; it does not invent the POST.

---

## Flagship: AI Admission Advisor (the one to build)

### The experience
A student opens the advisor (e.g. promote the existing FAB into a "Chat with an
advisor" option) and types:

> "I finished +2, want an online BBA, budget around 80k total"

The model calls `searchCourses({ courseType, deliveryMode, maxFee })`, your
Drizzle query runs, and the chat **streams a row of branded `<CourseCard/>`
components**. The student taps one →
`<FeeBreakdown/>` streams in. They ask "am I eligible?" →
`<EligibilityChecklist/>`. They say "I'm interested" → an **inline
`<LeadCaptureCard/>` appears, university + course already filled in**, posting to
the *same* `/api/lead-form` endpoint that exists today.

### Why this is the right first build
- **Conversion-first.** It funnels every conversation toward the existing lead pipeline, with `courseId`/`universityId` context attached — richer leads than the blind FAB.
- **Reuses everything.** Tools = existing queries. Submit = existing endpoint. Components = existing design tokens.
- **Measurable.** Fire the existing `track()` events (`lead_submit`, source `ai_advisor`) so you can A/B the advisor vs. the plain FAB in the data you already collect.

### Architecture (high level — not code)
```
Client: <Advisor/> chat  (useChat, @ai-sdk/react)
            │  user message
            ▼
Server: app/api/advisor/route.ts   (runtime = "nodejs", Fluid Compute)
            │  streamText / streamUI
            │  model via Vercel AI Gateway  ("anthropic/claude-haiku-4-5")
            ▼
Tools (typed, Zod):
  searchCourses(filter)      → getCourses()          [existing]
  getUniversity(slug)        → getUniversityBySlug() [existing]
  getCourseDetail(id)        → getCourseById()        [existing]
  compareUniversities(a,b)   → 2× getUniversityBySlug
  prepareLeadForm(ctx)       → returns prefill, renders <LeadCaptureCard/>
            │  each tool result paired with a component
            ▼
Streamed components (your design system):
  <CourseCard/> <FeeBreakdown/> <UniComparison/>
  <EligibilityChecklist/> <LeadCaptureCard/> → posts to /api/lead-form
```

### Stack recommendation
- **`ai` + `@ai-sdk/react`** (AI SDK v6). The standard for Next.js App Router.
- **Vercel AI Gateway** with plain `"provider/model"` strings — no provider SDK lock-in, gives observability + fallback. Default to **`anthropic/claude-haiku-4-5`** for a high-volume public chat (fast + cheap); escalate to `anthropic/claude-sonnet-4-6` only if answer quality needs it.
- **Node.js runtime on Fluid Compute** (per platform guidance — not edge).
- **Zod** for tool schemas (validates the model's args before they hit Drizzle).

> ⚠️ **Heed `AGENTS.md`:** this repo runs Next.js 16 with intentional breaking
> changes. Before writing the route handler / streaming code, read the relevant
> guide under `node_modules/next/dist/docs/` — App Router streaming and route
> conventions may differ from training data.

---

## Cost, risk & guardrails

| Concern | Reality | Mitigation |
|---|---|---|
| **API cost** | Public chat = unbounded calls | Haiku-class model; cap messages/conversation; short system prompt; rate-limit per visitor (you already have a `visitors` cookie + BotID available on Vercel) |
| **Hallucinated facts** | Fatal for fees/eligibility | Facts only from tool/DB results; system prompt: "never state a fee or eligibility you did not get from a tool" |
| **Latency** | Tool round-trips add seconds | Stream tokens immediately; show skeleton cards while tools run |
| **Abuse / spam leads** | Open endpoint | Vercel BotID + existing phone validation in `/api/lead-form` |
| **SEO regression** | LLM on render path = slow/uncrawlable | Advisor is client-island only; pages stay static + ISR |
| **Secrets** | Needs an API key / Gateway creds | `vercel env` (OIDC); never commit |
| **Maintenance** | New dependency surface | Tools are thin wrappers over existing queries — low ongoing cost |

**Rough budget:** with a Haiku-class model and ~6-turn average conversations,
expect cents per conversation. A daily/monthly spend cap + per-visitor rate
limit keeps it bounded. Validate with a real number before launch.

---

## Suggested phased rollout

1. **Phase 0 — Spike (½–1 day).** One route, one tool (`searchCourses`), stream a plain `<CourseCard/>`. Prove the loop end-to-end. No design polish.
2. **Phase 1 — Advisor MVP.** Add `getCourseDetail`, `<FeeBreakdown/>`, and the **inline `<LeadCaptureCard/>`** wired to `/api/lead-form`. Ship behind the FAB. Track `lead_submit` source `ai_advisor`.
3. **Phase 2 — Surface the tools elsewhere.** NL search on `/courses`; "compare" on university pages; eligibility checklist. All reuse Phase 1 tools.
4. **Phase 3 — (optional) Admin "ask your leads."** NL queries over `visitors`/`pageViews`/`leads`. Internal-only, gated behind admin auth.

Each phase is independently shippable and independently measurable against your
existing lead analytics.

---

## Open questions for the team
- **Provider/budget:** OK to use Vercel AI Gateway + a Claude Haiku-class model, with a monthly spend cap?
- **Entry point:** new "Chat" tab in the existing FAB, or a separate launcher?
- **Languages:** advisor in English only, or English + Malayalam (Kerala audience)? Affects model choice and prompt.
- **Success metric:** target lift in lead conversion rate (advisor sessions → `lead_submit`) vs. the current FAB?

---

## Bottom line
GenUI is a genuine fit here because the hard part — the data layer and the lead
pipeline — **already exists**. The advisor is mostly *wiring*, not new
infrastructure, and it points straight at lead acquisition. Start with the
Phase 0 spike to confirm the loop and a real cost number before committing.
