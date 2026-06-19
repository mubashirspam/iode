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
  GraduationCap,
  Baby,
  Check,
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
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    location: "Kochi, Kerala",
  },
  {
    name: "Arun Kumar",
    course: "BBA",
    university: "IGNOU",
    quote:
      "As a working professional, I was worried about balancing work and studies. Vidyavasal helped me find the perfect distance learning program that fits my schedule.",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Thrissur, Kerala",
  },
  {
    name: "Deepa Menon",
    course: "Montessori TTC",
    university: "Vidyavasal",
    quote:
      "The Montessori training program completely transformed my teaching approach. The counselors were so supportive throughout my journey. Highly recommend!",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
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
  { Icon: Target, title: "100% Admission Success", desc: "A near-perfect track record for university placements." },
  { Icon: Zap, title: "Fast Processing", desc: "Get admitted in as little as 2–3 weeks with expedited enrollment." },
  { Icon: Wallet, title: "Best Fee Guidance", desc: "We help you find the best fee structures and EMI options." },
  { Icon: Headset, title: "End-to-End Support", desc: "From document collection to degree certificate — we handle it all." },
  { Icon: Award, title: "UGC & DEB Approved", desc: "Only fully recognized universities — your degree is valid nationwide." },
  { Icon: Handshake, title: "Free Consultation", desc: "No fees, no obligations — our first consultation is always free." },
];

const steps = [
  { step: "01", title: "Free Consultation", desc: "Speak with expert counselors about your goals, qualifications and preferred programs.", Icon: MessageCircle },
  { step: "02", title: "Choose University", desc: "We present the best-matched universities and courses based on your profile.", Icon: Landmark },
  { step: "03", title: "Enroll & Apply", desc: "We handle paperwork, document verification and submission for smooth enrollment.", Icon: FileCheck },
  { step: "04", title: "Succeed & Grow", desc: "Ongoing support, placement assistance and mentoring — until you succeed.", Icon: Rocket },
];

export default async function Home() {
  const [homeUniversities, marqueeUniversities] = await Promise.all([
    getHomeUniversities(12),
    getUniversityLogos(),
  ]);

  return (
    <div className="flex flex-col">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative overflow-hidden -mt-[80px] border-b border-[var(--line)]">
        <Image
          src="https://ik.imagekit.io/vidyavasal/hero.png?updatedAt=1780493516691"
          alt="Vidyavasal — university admissions and distance education"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white via-white/90 to-white/20 md:from-white/97 md:via-white/70 md:to-transparent" />

        <div className="container mx-auto max-w-7xl px-4 pb-14 pt-[136px] sm:px-6 md:pb-20 md:pt-[160px] lg:px-8">
          <div className="max-w-xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#15151A] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
              </span>
              Admissions Open 2026
              <span className="hidden text-[#8A8A94] sm:inline">· 5,000+ students</span>
            </span>

            <h1 className="text-[2rem] font-bold leading-[1.1] tracking-tight text-[#15151A] sm:text-4xl lg:text-[3.25rem]">
              Your gateway to <span className="text-accent">top universities</span> across India
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#5B5B66] md:text-lg">
              Expert admission guidance for UG, PG, MBA &amp; distance degree programs —
              connecting you to <span className="font-semibold text-[#15151A]">25+ UGC-recognized universities</span> and 120+ courses.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/admissions" className="btn-primary btn-press inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold">
                Start Your Admission
                <ArrowRight className="h-4 w-4 cta-arrow" />
              </Link>
              <Link href="/courses" className="btn-outline btn-press inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold">
                <Search className="h-4 w-4" />
                Browse Courses
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {[
                { Icon: ShieldCheck, text: "UGC & DEB Approved" },
                { Icon: Target, text: "Expert Counselors" },
                { Icon: Gift, text: "Free Consultation" },
              ].map(({ Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#5B5B66] backdrop-blur-sm">
                  <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ MARQUEE ══════════════════════ */}
      <section className="border-b border-[var(--line)] bg-white py-5">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#8A8A94]">
          Trusted partner of India&apos;s leading universities
        </p>
        {marqueeUniversities.length > 0 ? (
          <UniversityMarquee universities={marqueeUniversities} />
        ) : (
          <div className="marquee-container">
            <div className="marquee-track">
              {[...trustBadges, ...trustBadges].map((name, i) => (
                <div key={i} className="mx-8 flex shrink-0 items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="whitespace-nowrap text-sm font-medium text-[#6E6E73]">{name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════ PROGRAMS (BENTO) ══════════════════════ */}
      <section className="section-y bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Our Programs"
              title={<>Three paths to your <span className="text-accent">dream career</span></>}
              subtitle="Choose the program designed for your goals, timeline and budget."
            />
            <Link href="/courses" className="btn-outline btn-press inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold md:self-auto">
              View All Courses
              <ArrowRight className="h-4 w-4 cta-arrow" />
            </Link>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Large card — University Admissions */}
            <ScrollReveal className="md:col-span-2">
              <Link href="/admissions" className="group block h-full">
                <div className="card-minimal flex h-full flex-col p-7 md:p-9">
                  <div className="flex items-center gap-3">
                    <span className="icon-tile h-12 w-12">
                      <GraduationCap className="h-6 w-6" />
                    </span>
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--accent)]">
                      Most Popular
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#15151A] md:text-2xl">University Admissions</h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#5B5B66]">
                    Expert guidance for UG, PG, MBA and Diploma programs at India&apos;s top universities — end-to-end support from selection to enrollment.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    {["UG Programs", "PG / MBA", "Distance Learning", "Online Degrees", "Diploma / Certificate", "Dual Degree"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-[#15151A]">
                        <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
                    Explore admissions
                    <ArrowRight className="h-4 w-4 cta-arrow" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>

            {/* Montessori card */}
            <ScrollReveal delay={120}>
              <Link href="/montessori" className="group block h-full">
                <div className="card-minimal flex h-full flex-col p-7">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8FAF0] text-[#059669]">
                    <Baby className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#15151A]">Montessori</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#5B5B66]">
                    Expert training and certification for aspiring Montessori educators.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["TTC", "Teacher Training", "Child Dev."].map((t) => (
                      <span key={t} className="rounded-lg bg-[#E8FAF0] px-2.5 py-1 text-xs font-semibold text-[#059669]">{t}</span>
                    ))}
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-[#059669]">
                    Learn more
                    <ArrowRight className="h-4 w-4 cta-arrow" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════ UNIVERSITIES ══════════════════════ */}
      <section className="section-y bg-[var(--surface-2)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-9 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Partner Universities"
              title={<>Top universities <span className="text-accent">we work with</span></>}
              subtitle="All UGC-recognized — your degree is valid across India."
            />
            <Link href="/universities" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--accent)] hover:underline">
              View all universities
              <ArrowRight className="h-4 w-4 cta-arrow" />
            </Link>
          </ScrollReveal>

          <HomeUniversities data={homeUniversities} />
        </div>
      </section>

      {/* ══════════════════════ STATS ══════════════════════ */}
      <section className="border-y border-[var(--line)] bg-white py-12 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-5">
            <StatCounter target={5000} suffix="+" label="Happy Students" />
            <StatCounter target={3500} suffix="+" label="Admissions Done" />
            <StatCounter target={25} suffix="+" label="Partner Universities" />
            <StatCounter target={120} suffix="+" label="Courses Available" />
            <StatCounter target={8} suffix="+" label="Years Experience" className="col-span-2 md:col-span-1" />
          </div>
        </div>
      </section>

      {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
      <section className="section-y bg-[var(--surface-2)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <SectionHeading
              eyebrow="Your Journey"
              title={<>From consultation to <span className="text-accent">graduation</span></>}
              subtitle="A simple 4-step process that gets you admitted without the stress."
              className="mx-auto"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ step, title, desc, Icon }, i) => (
              <ScrollReveal key={step} delay={i * 80}>
                <div className="card-minimal h-full p-6">
                  <div className="flex items-center justify-between">
                    <span className="icon-tile h-11 w-11">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-2xl font-bold text-[var(--line)]">{step}</span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-[#15151A]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5B5B66]">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ WHY CHOOSE US ══════════════════════ */}
      <section className="section-y bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Image */}
            <ScrollReveal className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)]">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
                  alt="Students learning together with expert guidance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white/95 p-3.5 backdrop-blur-sm">
                  <span className="icon-tile h-11 w-11">
                    <Award className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-bold leading-none text-[#15151A]">100% Success</p>
                    <p className="mt-1 text-xs text-[#8A8A94]">Admission track record</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Features */}
            <div className="lg:col-span-7">
              <ScrollReveal className="mb-7">
                <SectionHeading
                  align="left"
                  eyebrow="Why Vidyavasal?"
                  title={<>Why 5,000+ students chose <span className="text-accent">Vidyavasal</span></>}
                />
              </ScrollReveal>
              <div className="grid gap-3 sm:grid-cols-2">
                {features.map((f, i) => (
                  <ScrollReveal key={f.title} delay={i * 70}>
                    <div className="card-minimal flex h-full items-start gap-3.5 p-5">
                      <span className="icon-tile h-10 w-10 shrink-0">
                        <f.Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#15151A]">{f.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-[#5B5B66]">{f.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
      <section className="section-y bg-[var(--surface-2)]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-10 text-center">
            <SectionHeading
              eyebrow="Student Stories"
              icon={<Star className="h-3.5 w-3.5 fill-current" />}
              title={<>Real students, <span className="text-accent">real results</span></>}
              subtitle="Hear from students who transformed their careers with Vidyavasal."
              className="mx-auto"
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 90}>
                <div className="card-minimal flex h-full flex-col p-6">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[#3A3A3C]">“{t.quote}”</p>
                  <div className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                      <Image src={t.photo} alt={t.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#15151A]">{t.name}</p>
                      <p className="text-xs text-[#8A8A94]">{t.course} · {t.university} · {t.location}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      <section className="section-y bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a3e] via-[#241056] to-[#0f1e54] px-6 py-12 text-center md:px-12 md:py-16">
              <div className="dot-pattern absolute inset-0 opacity-10" />
              <div className="absolute -top-16 -right-10 h-64 w-64 rounded-full bg-[#7C3AED]/30 blur-3xl" />
              <div className="relative">
                <span className="glass-soft mb-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-white/85">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
                  </span>
                  Admissions Open 2026
                </span>
                <h2 className="mx-auto max-w-2xl text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                  Ready to get admitted to your dream university?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
                  Join 5,000+ students who transformed their futures with Vidyavasal&apos;s expert
                  guidance. Free consultation — no obligation.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/contact" className="btn-press inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#1a1040] transition-colors hover:bg-gray-100">
                    Apply Now — It&apos;s Free
                    <ArrowRight className="h-4 w-4 cta-arrow" />
                  </Link>
                  <a href="https://wa.me/917034760995" target="_blank" rel="noopener noreferrer" className="glass-soft btn-press inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/15">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
