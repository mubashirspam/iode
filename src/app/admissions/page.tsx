import { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "University Admissions",
  description: "Get admitted to top universities across India with Vidyavasal's expert admission guidance. UG, PG, MBA, Diploma programs from 25+ UGC-recognized universities.",
  alternates: { canonical: "/admissions" },
};

const admissionsJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "University Admissions Guidance",
  "provider": { "@id": `${SITE_URL}/#organization` },
  "description": "Expert guidance for UG, PG, MBA, and Diploma admissions to top Indian universities",
  "areaServed": "IN",
  "serviceType": "Education Consulting"
};

const programs = [
  {
    title: 'UG Programs',
    desc: 'Bachelor\'s degrees in Arts, Science, Commerce, and Computer Applications.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>,
    courses: ['BA', 'B.Com', 'BBA', 'BCA', 'BSc'],
    color: '#007AFF',
    bg: 'service-card-blue',
    grad: 'from-[#007AFF] to-[#5AC8FA]',
  },
  {
    title: 'PG Programs',
    desc: 'Master\'s degrees to advance your career and expertise in your field.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>,
    courses: ['MBA', 'MCA', 'M.Com', 'MA', 'MSc'],
    color: '#7B61FF',
    bg: 'service-card-purple',
    grad: 'from-[#7B61FF] to-[#007AFF]',
  },
  {
    title: 'Diploma Programs',
    desc: 'Short-term professional diplomas for quick skill development and career pivots.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>,
    courses: ['PGDM', 'PG Diploma', 'Certificate'],
    color: '#FF9500',
    bg: 'service-card-orange',
    grad: 'from-[#FF9500] to-[#FF6B00]',
  },
];

const universities = [
  { name: 'Manipal University', abbr: 'MU', mode: 'Online', grad: 'from-[#7B61FF] to-[#007AFF]' },
  { name: 'IGNOU', abbr: 'IG', mode: 'Distance', grad: 'from-[#007AFF] to-[#5AC8FA]' },
  { name: 'Symbiosis University', abbr: 'SU', mode: 'Online', grad: 'from-[#FF9500] to-[#FF6B00]' },
  { name: 'Annamalai University', abbr: 'AU', mode: 'Distance', grad: 'from-[#34C759] to-[#00A844]' },
  { name: 'Bharathiar University', abbr: 'BU', mode: 'Distance', grad: 'from-[#5AC8FA] to-[#007AFF]' },
  { name: 'Osmania University', abbr: 'OU', mode: 'Distance', grad: 'from-[#FF3B30] to-[#FF6B00]' },
];

const steps = [
  { num: '01', title: 'Initial Consultation', desc: 'A free 30-minute call with our senior counselor to understand your profile, goals, and budget.' },
  { num: '02', title: 'University Shortlisting', desc: 'We present a curated list of best-matched universities and programs from our partner network.' },
  { num: '03', title: 'Document Preparation', desc: 'We guide you on collecting and verifying all required documents — no confusion, no delays.' },
  { num: '04', title: 'Application Submission', desc: 'We handle the application process end-to-end, ensuring 100% accuracy and timely submission.' },
  { num: '05', title: 'Admission Confirmed', desc: 'You receive your admission letter. We continue supporting you through orientation and registration.' },
];

export default function AdmissionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--line)] bg-[var(--surface-2)] py-12 md:py-16">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center">
            <span className="eyebrow mb-4 inline-flex">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              University Admissions 2026
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#15151A] mt-3 mb-5 leading-tight">
              Get admitted to your{' '}
              <span className="text-accent">dream university</span>
            </h1>
            <p className="text-[15px] md:text-base text-[#5B5B66] max-w-2xl mx-auto mb-8 leading-relaxed">
              Expert admission guidance for 25+ UGC-recognized universities across India.
              UG, PG, MBA, and Diploma programs — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contact" className="btn-primary btn-press px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2">
                Start Free Consultation
                <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
              <Link href="/courses" className="btn-outline btn-press px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2">
                Browse 120+ Courses
              </Link>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-8">
              {['UGC Recognized', 'Free Counseling', 'Quick Admission', 'EMI Available', '5,000+ Students'].map((chip) => (
                <span key={chip} className="border border-[var(--line)] bg-white px-3.5 py-1.5 rounded-full text-sm font-medium text-[#5B5B66] flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-[#34C759]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="section-y bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="eyebrow mb-4 inline-flex">Program Types</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3">What we help you get into</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.title} className={`rounded-3xl p-8 border border-[#E5E5EA] card-hover relative overflow-hidden ${p.bg}`}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                  style={{background: `radial-gradient(circle, ${p.color}, transparent)`}}></div>
                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.grad} flex items-center justify-center mb-5 shadow-lg`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">{p.icon}</svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">{p.title}</h3>
                  <p className="text-[#6E6E73] text-sm mb-5 leading-relaxed">{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.courses.map((c) => (
                      <span key={c} className="px-2.5 py-1 bg-white/70 rounded-lg text-xs font-semibold" style={{color: p.color}}>{c}</span>
                    ))}
                  </div>
                  <Link href="/contact" className="font-semibold text-sm flex items-center gap-1.5" style={{color: p.color}}>
                    Enquire Now <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Universities */}
      <section className="section-y bg-[var(--surface-2)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 inline-flex">Partner Network</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3">Universities we work with</h2>
            <p className="text-[#6E6E73] mt-3 max-w-lg mx-auto">All universities are UGC-recognized with DEB-approved distance education programs.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {universities.map((uni) => (
              <div key={uni.name} className="university-card bg-white rounded-2xl p-5 border border-[#E5E5EA] flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${uni.grad} flex items-center justify-center text-white font-bold text-lg`}>
                  {uni.abbr}
                </div>
                <div>
                  <p className="text-[#1D1D1F] font-semibold text-sm leading-tight">{uni.name}</p>
                  <span className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${uni.mode === 'Online' ? 'bg-[#FFF3E0] text-[#FF9500]' : 'bg-[#F5F5F7] text-[#6E6E73]'}`}>
                    {uni.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses" className="inline-flex items-center gap-2 text-[#7B61FF] font-semibold hover:underline">
              View all 25+ universities &amp; 120+ courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="section-y bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-14">
            <span className="eyebrow mb-4 inline-flex">Step by Step</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3">How the admission process works</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#7B61FF] via-[#007AFF] to-[#34C759]"></div>
            <div className="space-y-6">
              {steps.map((s) => (
                <div key={s.num} className="flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center text-white font-bold text-sm shrink-0 z-10 relative">
                    {s.num}
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-[#E5E5EA] flex-1 card-hover">
                    <h3 className="font-bold text-[#1D1D1F] mb-1">{s.title}</h3>
                    <p className="text-[#6E6E73] text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center" style={{background: 'linear-gradient(135deg, #1a1040 0%, #0f172a 100%)'}}>
            <div className="absolute inset-0 dot-pattern opacity-15"></div>
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{background: 'radial-gradient(circle, #7B61FF, transparent)'}}></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Admissions are open now</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">Don&apos;t miss the 2026 intake. Talk to our counselors today — free, no-obligation consultation.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-[#1a1040] font-bold hover:bg-gray-100 transition-colors btn-press flex items-center justify-center gap-2">
                  Book Free Consultation
                  <svg className="w-5 h-5 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
                <a href="https://wa.me/917034760995" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(admissionsJsonLd) }}
      />
    </div>
  );
}
