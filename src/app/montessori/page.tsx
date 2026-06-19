import { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Sprout,
  School,
  MessageCircle,
  HeartHandshake,
  BookOpen,
  Briefcase,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Montessori Counseling & Training",
  description: "Build a rewarding career in early childhood education with Vidyavasal's Montessori TTC programs. Recognized training for aspiring Montessori teachers.",
};

const modules = [
  {
    num: '01',
    title: 'Montessori Philosophy',
    desc: 'Deep dive into Dr. Maria Montessori\'s educational philosophy, child-centered learning, and the prepared environment concept.',
  },
  {
    num: '02',
    title: 'Child Psychology',
    desc: 'Understanding child development stages, cognitive growth, emotional intelligence, and behavioral patterns from 0–12 years.',
  },
  {
    num: '03',
    title: 'Curriculum Design',
    desc: 'Practical skills for designing Montessori materials, lesson plans, and activity-based learning for different age groups.',
  },
  {
    num: '04',
    title: 'Classroom Management',
    desc: 'Techniques for managing a Montessori classroom, maintaining discipline, and fostering an environment of independent learning.',
  },
  {
    num: '05',
    title: 'Practical Training',
    desc: 'Hands-on classroom practice at partner Montessori schools with mentoring from experienced educators.',
  },
  {
    num: '06',
    title: 'Assessment & Certification',
    desc: 'End-of-program assessment and internationally recognized Montessori TTC certificate upon successful completion.',
  },
];

const careers = [
  { title: 'Montessori Teacher', where: 'Preschools & Kindergartens', Icon: GraduationCap },
  { title: 'Preschool Director', where: 'Own school / institution', Icon: School },
  { title: 'Child Counselor', where: 'Schools & Child care centers', Icon: MessageCircle },
  { title: 'Special Educator', where: 'Inclusion schools & NGOs', Icon: HeartHandshake },
  { title: 'Educational Consultant', where: 'Curriculum development', Icon: BookOpen },
  { title: 'Corporate Trainer', where: 'Early childhood companies', Icon: Briefcase },
];

export default function MontessoriPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--line)] bg-[var(--surface-2)] py-12 md:py-16">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8FAF0] text-[#059669] text-xs font-bold uppercase tracking-[0.04em] mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Early Childhood Education
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 text-[#15151A] leading-tight">
            Montessori counseling{" "}
            &amp; <span className="text-[#059669]">teacher training</span>
          </h1>
          <p className="text-[15px] md:text-base text-[#5B5B66] mb-8 leading-relaxed max-w-2xl mx-auto">
            Shape the future by nurturing young minds. Become a certified Montessori educator with Vidyavasal&apos;s comprehensive training and counseling programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="px-7 py-3.5 rounded-full bg-[#059669] text-white font-semibold hover:bg-[#047857] transition-colors btn-press flex items-center justify-center gap-2">
              Join the Program
              <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
            <a href="https://wa.me/917034760995" target="_blank" rel="noopener noreferrer" className="btn-outline px-7 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-[#34C759]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp for Details
            </a>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-8">
            {[
              { value: '1 Year', label: 'Program Duration' },
              { value: '500+', label: 'Certified Teachers' },
              { value: '100%', label: 'Placement Support' },
              { value: 'Recognized', label: 'Certificate' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-center">
                <p className="text-lg font-extrabold text-[#15151A]">{s.value}</p>
                <p className="text-xs text-[#8A8A94] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Montessori */}
      <section className="section-y bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8FAF0] text-[#34C759] text-sm font-semibold mb-4">Why Montessori?</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3 mb-6 leading-tight">
                A career that shapes<br />young futures
              </h2>
              <div className="space-y-4">
                {[
                  'Growing demand for Montessori-trained teachers across India',
                  'Higher salaries compared to traditional early childhood roles',
                  'International recognition of Montessori certification',
                  'Opportunity to start your own preschool',
                  'Deeply fulfilling — impact a child\'s entire life trajectory',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#E8FAF0] text-[#34C759] flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-[#1D1D1F] text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="service-card-green rounded-3xl p-8 relative overflow-hidden border border-[#E5E5EA]">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
                style={{background: 'radial-gradient(circle, #34C759, transparent)'}}></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#34C759]/15 text-[#34C759] flex items-center justify-center mb-4">
                  <Sprout className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] mb-3">Montessori TTC Certificate</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed mb-4">
                  Our Teacher Training Certificate (TTC) program is designed for aspiring educators with a passion for early childhood education. No prior teaching experience required.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Duration', value: '1 Year' },
                    { label: 'Mode', value: 'Distance' },
                    { label: 'Age Group', value: '1.5 – 6 yrs' },
                    { label: 'Certificate', value: 'Recognized' },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-[#AEAEB2]">{item.label}</p>
                      <p className="font-semibold text-[#1D1D1F] text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Modules */}
      <section className="section-y bg-[var(--surface-2)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8FAF0] text-[#34C759] text-sm font-semibold mb-4">Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3">Training modules overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => (
              <div key={m.num} className="bg-white rounded-2xl p-6 border border-[#E5E5EA] card-hover">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#34C759] to-[#00A844] flex items-center justify-center text-white font-bold text-sm mb-4">
                  {m.num}
                </div>
                <h3 className="font-bold text-[#1D1D1F] mb-2">{m.title}</h3>
                <p className="text-[#6E6E73] text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Prospects */}
      <section className="section-y bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center mb-12">
            <span className="eyebrow mb-4 inline-flex">Career Paths</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mt-3">Where our graduates work</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {careers.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-5 border border-[#E5E5EA] university-card text-center">
                <div className="w-12 h-12 rounded-xl bg-[#E8FAF0] text-[#10B981] flex items-center justify-center mx-auto mb-3">
                  <c.Icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-[#1D1D1F] text-sm">{c.title}</p>
                <p className="text-[#AEAEB2] text-xs mt-1">{c.where}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <div className="rounded-3xl p-10 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #34C759 0%, #00A844 100%)'}}>
            <div className="absolute inset-0 dot-pattern opacity-20"></div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-4">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Begin your Montessori journey</h2>
              <p className="text-white/80 mb-8">Join 500+ certified Montessori educators who started their journey with Vidyavasal. Free consultation available.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="px-8 py-4 rounded-full bg-white text-[#00A844] font-bold hover:bg-green-50 transition-colors btn-press flex items-center justify-center gap-2">
                  Enroll Now
                  <svg className="w-5 h-5 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </Link>
                <Link href="/courses" className="px-8 py-4 rounded-full bg-white/20 border border-white/30 text-white font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
                  View Curriculum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
