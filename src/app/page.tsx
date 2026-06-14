import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Target,
  Gift,
  Landmark,
  Star,
  Zap,
  Wallet,
  Headset,
  Award,
  Handshake,
  MessageCircle,
  FileCheck,
  Rocket,
} from "lucide-react";
import { StatCounter } from "@/components/StatCounter";
import { ScrollReveal } from "@/components/ScrollReveal";
import HomeUniversities from "@/components/HomeUniversities";
import UniversityMarquee from "@/components/UniversityMarquee";
import SectionHeading from "@/components/SectionHeading";
import { getHomeUniversities, getUniversityLogos } from "@/lib/db/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Admissions & Distance Education | Vidyavasal Kerala",
  description:
    "Vidyavasal helps 5,000+ students get admitted to top universities across India. Expert guidance for distance education, +1, +2, UG, PG, MBA admissions and courses.",
};

// Revalidate hourly so newly added universities and admission-status changes
// from the tracker show up without a redeploy.
export const revalidate = 3600;

const testimonials = [
  {
    name: "Priya Nair",
    course: "MBA",
    university: "Manipal University",
    quote:
      "Vidyavasal guided me step-by-step through the entire MBA admission process. Got admitted to my dream university within 3 weeks. Truly exceptional service!",
    initials: "PN",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    gradFrom: "#4F46E5",
    gradTo: "#7C3AED",
    location: "Kochi, Kerala",
  },
  {
    name: "Arun Kumar",
    course: "BBA",
    university: "IGNOU",
    quote:
      "As a working professional, I was worried about balancing work and studies. Vidyavasal helped me find the perfect distance learning program that fits my schedule.",
    initials: "AK",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    gradFrom: "#0EA5E9",
    gradTo: "#06B6D4",
    location: "Thrissur, Kerala",
  },
  {
    name: "Deepa Menon",
    course: "Montessori TTC",
    university: "Vidyavasal",
    quote:
      "The Montessori training program completely transformed my teaching approach. The counselors were so supportive throughout my journey. Highly recommend!",
    initials: "DM",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    gradFrom: "#10B981",
    gradTo: "#059669",
    location: "Kozhikode, Kerala",
  },
];

const trustBadges = [
  "Manipal University",
  "IGNOU",
  "Symbiosis",
  "Annamalai University",
  "Osmania University",
  "Bharathiar University",
  "Madurai Kamaraj",
  "Periyar University",
  "University of Madras",
  "GLA University",
  "Amrita University",
  "Andhra University",
];

const features = [
  {
    Icon: Target,
    title: "100% Admission Success",
    desc: "Our counselors have a near-perfect track record for university placements.",
  },
  {
    Icon: Zap,
    title: "Fast Processing",
    desc: "Get admitted in as little as 2–3 weeks with our expedited enrollment process.",
  },
  {
    Icon: Wallet,
    title: "Best Fee Guarantee",
    desc: "We negotiate the best fee structures and EMI options on your behalf.",
  },
  {
    Icon: Headset,
    title: "End-to-End Support",
    desc: "From document collection to degree certificate — we handle it all.",
  },
  {
    Icon: Award,
    title: "UGC & DEB Approved",
    desc: "Only universities with full UGC and DEB recognition — your degree is valid nationwide.",
  },
  {
    Icon: Handshake,
    title: "Free Consultation",
    desc: "No fees, no obligations — our first consultation is always free.",
  },
];

export default async function Home() {
  const [homeUniversities, marqueeUniversities] = await Promise.all([
    getHomeUniversities(12),
    getUniversityLogos(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden -mt-[80px] min-h-[90vh] flex items-center">
        {/* Background image (designed with empty space on the left for copy;
            on mobile we crop to the right so the subject stays visible) */}
        <Image
          src="https://ik.imagekit.io/vidyavasal/hero.png?updatedAt=1780493516691"
          alt="Vidyavasal — university admissions and distance education"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right -z-10"
        />
        {/* Legibility wash — strong on the left/mobile, fading toward the image */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/85 to-white/10 md:from-white/95 md:via-white/55 md:to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-[80px]">
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-card border border-white/70 mb-7 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34C759]"></span>
              </span>
              <span className="text-sm font-semibold text-[#1D1D1F]">
                Admissions Open 2026
              </span>
              <span className="hidden sm:inline text-sm text-[#6E6E73]">
                · 5,000+ students
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight mb-6 text-[#1D1D1F] leading-[1.07] animate-fade-in-up delay-100">
              Your Gateway to{" "}
              <span className="gradient-text-vivid">Top Universities</span>{" "}
              Across India
            </h1>

            <p className="text-lg md:text-xl text-[#3A3A3C] max-w-lg mb-9 leading-relaxed animate-fade-in-up delay-200">
              Expert admission guidance for UG, PG, MBA & distance degree
              programs. We connect you to{" "}
              <span className="font-semibold text-[#4F46E5]">
                25+ UGC-recognized universities
              </span>{" "}
              with 120+ courses.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center animate-fade-in-up delay-300 mb-9">
              <Link
                href="/admissions"
                className="px-8 py-4 rounded-full btn-gradient-vivid text-white font-bold text-base flex items-center justify-center gap-2 btn-press"
              >
                Start Your Admission
                <ArrowRight className="w-5 h-5 cta-arrow" />
              </Link>
              <Link
                href="/courses"
                className="px-8 py-4 rounded-full bg-white text-[#1D1D1F] font-semibold text-base border border-[#E5E5EA] hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Browse Courses
                <Search className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-in-up delay-400 flex flex-wrap gap-2.5">
              {[
                { Icon: ShieldCheck, text: "UGC & DEB Approved" },
                { Icon: Target, text: "Expert Counselors" },
                { Icon: Gift, text: "Free Consultation" },
              ].map(({ Icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 text-xs font-medium text-[#3A3A3C] shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-[#4F46E5]" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ MARQUEE ══════════════════════ */}
      <section className="py-5 bg-white border-y border-[#E5E5EA]">
        {marqueeUniversities.length > 0 ? (
          <UniversityMarquee universities={marqueeUniversities} />
        ) : (
          <div className="marquee-container">
            <div className="marquee-track">
              {[...trustBadges, ...trustBadges].map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 mx-8 shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#0EA5E9]" />
                  <span className="text-[#6E6E73] font-medium text-sm whitespace-nowrap">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════ PROGRAMS (BENTO) ══════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <SectionHeading
              align="left"
              eyebrow="Our Core Programs"
              title={
                <>
                  Three paths to your{" "}
                  <span className="gradient-text-vivid">dream career</span>
                </>
              }
              subtitle="Choose the program designed for your goals, timeline, and budget."
            />
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full btn-gradient text-white font-semibold text-sm btn-press shrink-0 self-start md:self-auto"
            >
              View All Courses
              <svg
                className="w-4 h-4 cta-arrow"
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
            </Link>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Large card — University Admissions */}
            <ScrollReveal
              className="md:col-span-2"
              delay={0}
            >
              <Link href="/admissions" className="block group h-full">
                <div className="relative overflow-hidden rounded-3xl h-full min-h-[340px] border border-[#E5E5EA] card-hover"
                  style={{
                    background: "linear-gradient(135deg, #F0EBFF 0%, #E5D9FF 50%, #dce8ff 100%)",
                  }}
                >
                  {/* Decorative orb */}
                  <div
                    className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-40 blur-2xl"
                    style={{
                      background:
                        "radial-gradient(circle, #7C3AED, #4F46E5, transparent)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-30 blur-2xl"
                    style={{
                      background: "radial-gradient(circle, #0EA5E9, transparent)",
                    }}
                  />

                  <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center mb-6 shadow-xl shadow-[#4F46E5]/30 glow-purple">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <span className="text-xs font-bold text-[#4F46E5] tracking-widest uppercase mb-2">
                      Most Popular
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-3">
                      University Admissions
                    </h3>
                    <p className="text-[#6E6E73] mb-6 leading-relaxed">
                      Expert guidance for UG, PG, MBA, and Diploma programs at
                      India&apos;s top universities. End-to-end support from selection
                      to enrollment.
                    </p>

                    {/* Feature list */}
                    <div className="grid grid-cols-2 gap-2 mb-8 flex-1">
                      {[
                        "UG Programs",
                        "PG / MBA",
                        "Distance Learning",
                        "Online Degrees",
                        "Diploma / Certificate",
                        "Dual Degree",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-[#1D1D1F]"
                        >
                          <div className="w-5 h-5 rounded-full bg-[#4F46E5]/15 flex items-center justify-center shrink-0">
                            <svg
                              className="w-3 h-3 text-[#4F46E5]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {["#4F46E5", "#7C3AED", "#0EA5E9", "#10B981"].map(
                          (c, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                              style={{ background: c }}
                            >
                              {["P", "A", "D", "R"][i]}
                            </div>
                          )
                        )}
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F5F5F7] flex items-center justify-center text-xs font-bold text-[#6E6E73]">
                          +99
                        </div>
                      </div>
                      <span className="font-bold text-[#4F46E5] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Explore
                        <svg
                          className="w-5 h-5 cta-arrow"
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
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Montessori card */}
            <ScrollReveal delay={120}>
              <Link href="/montessori" className="block group h-full">
                <div className="relative overflow-hidden rounded-3xl border border-[#E5E5EA] card-hover h-full min-h-[160px]"
                  style={{
                    background: "linear-gradient(135deg, #E8FAF0 0%, #D4F5E2 100%)",
                  }}
                >
                  <div
                    className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40 blur-xl"
                    style={{
                      background: "radial-gradient(circle, #10B981, transparent)",
                    }}
                  />
                  <div className="relative z-10 p-7">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center mb-4 shadow-lg shadow-[#10B981]/25">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-1.5">
                      Montessori
                    </h3>
                    <p className="text-[#6E6E73] text-sm mb-4 leading-relaxed">
                      Expert training for aspiring Montessori educators.
                    </p>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {["TTC", "Teacher Training", "Child Dev."].map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 bg-[#10B981]/15 text-[#059669] rounded-lg text-xs font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="font-semibold text-[#059669] text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                      Learn More
                      <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════ UNIVERSITIES ══════════════════════ */}
      <section className="py-20 md:py-28 section-mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <SectionHeading
              align="left"
              tone="blue"
              eyebrow="Partner Universities"
              title={
                <>
                  Top universities{" "}
                  <span className="gradient-text-vivid">we work with</span>
                </>
              }
              subtitle="All UGC-recognized — your degree is valid across India."
            />
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 text-[#4F46E5] font-semibold text-sm hover:underline shrink-0"
            >
              View all universities →
            </Link>
          </ScrollReveal>

          <HomeUniversities data={homeUniversities} />
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="py-16 md:py-20 dark-vivid-bg relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #4F46E5, transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(circle, #0EA5E9, transparent)",
          }}
        />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[0.8125rem] font-bold uppercase tracking-[0.06em] border border-white/15 mb-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
              </span>
              Our Impact
            </span>
            <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[2.85rem] font-extrabold tracking-tight text-white leading-[1.1]">
              Numbers that{" "}
              <span className="gradient-text-vivid">speak for themselves</span>
            </h2>
            <div className="section-accent mx-auto mt-5" />
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <ScrollReveal delay={0}><StatCounter target={5000} suffix="+" label="Happy Students" /></ScrollReveal>
            <ScrollReveal delay={80}><StatCounter target={3500} suffix="+" label="Admissions Done" /></ScrollReveal>
            <ScrollReveal delay={160}><StatCounter target={25} suffix="+" label="Partner Universities" /></ScrollReveal>
            <ScrollReveal delay={240}><StatCounter target={120} suffix="+" label="Courses Available" /></ScrollReveal>
            <ScrollReveal delay={320} className="col-span-2 md:col-span-1">
              <StatCounter target={8} suffix="+" label="Years Experience" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="py-20 md:py-28 section-mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal className="mb-14">
            <SectionHeading
              eyebrow="Your Journey"
              title={
                <>
                  From Consultation to{" "}
                  <span className="gradient-text-vivid">Graduation</span>
                </>
              }
              subtitle="Our simple 4-step process gets you admitted to your dream university without the stress."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                title: "Free Consultation",
                color: "#4F46E5",
                colorLight: "#EEF2FF",
                desc: "Speak with our expert counselors about your goals, qualifications, and preferred programs.",
                Icon: MessageCircle,
              },
              {
                step: "02",
                title: "Choose University",
                color: "#0EA5E9",
                colorLight: "#E0F7FF",
                desc: "We present the best-matched universities and courses based on your profile and aspirations.",
                Icon: Landmark,
              },
              {
                step: "03",
                title: "Enroll & Apply",
                color: "#10B981",
                colorLight: "#E8FAF0",
                desc: "We handle all paperwork, document verification, and submission to ensure smooth enrollment.",
                Icon: FileCheck,
              },
              {
                step: "04",
                title: "Succeed & Grow",
                color: "#F59E0B",
                colorLight: "#FFFBEB",
                desc: "With ongoing support, placement assistance, and mentoring — we stay with you till you succeed.",
                Icon: Rocket,
              },
            ].map(({ step, title, color, colorLight, desc, Icon }, i) => (
              <ScrollReveal key={step} delay={i * 100}>
                <div
                  className="rounded-2xl p-7 border border-[#E5E5EA] card-hover relative overflow-hidden h-full"
                  style={{ background: colorLight }}
                >
                  {/* Big bg number */}
                  <span
                    className="step-bg-number"
                    style={{ color }}
                  >
                    {step}
                  </span>

                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-sm"
                      style={{ background: `${color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color }} />
                    </div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase block mb-1"
                      style={{ color }}
                    >
                      Step {step}
                    </span>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color }}
                    >
                      {title}
                    </h3>
                    <p className="text-[#6E6E73] text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ WHY CHOOSE US ══════════════════════ */}
      <section className="py-20 md:py-28 hero-mesh-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal className="mb-14">
            <SectionHeading
              eyebrow="Why Vidyavasal?"
              title={
                <>
                  Why 5,000+ students chose{" "}
                  <span className="gradient-text-vivid">Vidyavasal</span>
                </>
              }
            />
          </ScrollReveal>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image */}
            <ScrollReveal className="lg:col-span-5">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-[#4F46E5]/10 border-4 border-white aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students learning together with expert guidance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a3e]/40 via-transparent to-transparent" />
                {/* Overlay stat card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#1D1D1F] text-lg leading-none">100% Success</p>
                    <p className="text-[#6E6E73] text-xs mt-1">Admission track record</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Features */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <ScrollReveal key={f.title} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] card-hover flex gap-4 items-start h-full">
                    <div className="w-12 h-12 rounded-xl bg-[#F0EBFF] flex items-center justify-center shrink-0">
                      <f.Icon className="w-6 h-6 text-[#4F46E5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1D1D1F] mb-1">
                        {f.title}
                      </h3>
                      <p className="text-[#6E6E73] text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <ScrollReveal className="mb-14">
            <SectionHeading
              eyebrow="Student Stories"
              icon={<Star className="w-3.5 h-3.5 fill-current" />}
              title={
                <>
                  Real students,{" "}
                  <span className="gradient-text-vivid">real results</span>
                </>
              }
              subtitle="Hear from students who transformed their careers with Vidyavasal's guidance."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <div className="relative bg-white rounded-2xl p-7 border border-[#E5E5EA] card-hover h-full flex flex-col">
                  {/* Big quote mark */}
                  <span
                    className="absolute top-5 right-6 text-6xl font-serif opacity-08 leading-none select-none"
                    style={{ color: t.gradFrom, opacity: 0.15 }}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        className="w-4 h-4 text-[#F59E0B]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-[#1D1D1F] mb-6 leading-relaxed text-sm flex-1 relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-5 border-t border-[#F5F5F7]">
                    <div
                      className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-white"
                      style={{
                        background: `linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`,
                      }}
                    >
                      <Image
                        src={t.photo}
                        alt={t.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1D1D1F] text-sm">{t.name}</p>
                      <p className="text-[#6E6E73] text-xs">
                        {t.course} · {t.university}
                      </p>
                      <p className="text-[#AEAEB2] text-xs">{t.location}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center noise-overlay"
              style={{
                background:
                  "linear-gradient(135deg, #1a0a3e 0%, #0f0c29 35%, #0a1628 65%, #060d1e 100%)",
              }}
            >
              <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />
              <div
                className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #4F46E5, transparent)",
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #0EA5E9, transparent)",
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #10B981, transparent)",
                }}
              />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-[0.8125rem] font-bold uppercase tracking-[0.06em] border border-white/15 mb-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
                  </span>
                  Admissions Open 2026
                </span>
                <h2 className="text-[2rem] md:text-5xl font-extrabold text-white mb-5 leading-[1.1] tracking-tight">
                  Ready to Get Admitted to Your
                  <br className="hidden md:block" />
                  <span className="gradient-text-vivid">Dream University?</span>
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join 5,000+ students who have transformed their futures with
                  Vidyavasal&apos;s expert admission guidance. Free consultation — no
                  obligation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="px-8 py-4 rounded-full bg-white text-[#1a1040] font-bold text-base hover:bg-gray-100 transition-colors shadow-lg btn-press flex items-center justify-center gap-2"
                  >
                    Apply Now — It&apos;s Free
                    <svg
                      className="w-5 h-5 cta-arrow"
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
                  </Link>
                  <a
                    href="https://wa.me/917034760995"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
