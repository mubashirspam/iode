import { Metadata } from "next";
<<<<<<< HEAD
import { ScrollReveal } from "@/components/ScrollReveal";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Gift,
  Zap,
  Target,
  Lock,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
=======
import { submitContactForm } from "@/lib/actions/leads";
>>>>>>> feat/university-course-experience

export const metadata: Metadata = {
  title: "Contact Vidyavasal — Free University Admission Consultation",
  description:
    "Get in touch with Vidyavasal for university admissions, counseling, and general inquiries. Free consultation available — open all hours.",
};

const contactMethods = [
  {
    Icon: Phone,
    label: "Call Us",
    value: "+91 70347 60995",
    sub: "Open All Hours",
    href: "tel:+917034760995",
    color: "#4F46E5",
    bg: "from-[#EEF2FF] to-[#E0E7FF]",
  },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat Instantly",
    sub: "Typical reply in 5 min",
    href: "https://wa.me/917034760995",
    color: "#10B981",
    bg: "from-[#ECFDF5] to-[#D1FAE5]",
  },
  {
    Icon: Mail,
    label: "Email Us",
    value: "info@vidyavasal.com",
    sub: "Reply within 2 hours",
    href: "mailto:info@vidyavasal.com",
    color: "#0EA5E9",
    bg: "from-[#E0F7FF] to-[#BAE6FD]",
  },
  {
    Icon: MapPin,
    label: "Office",
    value: "Manathavady, Kerala",
    sub: "PIN 670645",
    href: "#",
    color: "#F59E0B",
    bg: "from-[#FFFBEB] to-[#FEF3C7]",
  },
];

const reasons = [
  { Icon: Gift, title: "Free Consultation", desc: "No fees, no hidden costs for your first counseling session." },
  { Icon: Zap, title: "Fast Response", desc: "Our team replies within 2 hours on business days." },
  { Icon: Target, title: "Expert Matching", desc: "We find the exact university and course that fits your goals." },
  { Icon: Lock, title: "100% Confidential", desc: "Your information is private and never shared with third parties." },
];

export default function ContactPage() {
  return (
    <div>
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[#F5F5F7] py-12 md:py-16">
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <ScrollReveal>
            <span className="eyebrow mb-4 inline-flex">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#15151A] mt-3 mb-5 leading-tight">
              Talk to our{" "}
              <span className="text-accent">admission experts</span>
            </h1>
            <p className="text-[15px] md:text-base text-[#5B5B66] max-w-xl mx-auto mb-8">
              Free consultation — no obligation. We&apos;ll help you find the perfect university and program for your goals.
            </p>

            {/* Live indicator */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white rounded-full border border-[var(--line)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#34C759]" />
              </span>
              <span className="text-sm font-medium text-[#15151A]">
                Counselors are available now
              </span>
              <span className="text-sm text-[#8A8A94]">· Open All Hours</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════ CONTACT METHODS ══════════════════════ */}
      <section className="py-8 bg-[#F5F5F7] border-b border-[#E5E5EA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contactMethods.map((m, i) => (
              <ScrollReveal key={m.label} delay={i * 80}>
                <a
                  href={m.href}
                  target={m.href.startsWith("http") ? "_blank" : undefined}
                  rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`flex flex-col items-center text-center p-5 rounded-2xl border border-[#E5E5EA] card-hover bg-gradient-to-br ${m.bg} group`}
                >
                  <span className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mb-3" style={{ color: m.color }}>
                    <m.Icon className="w-6 h-6" />
                  </span>
                  <p className="font-semibold text-[#1D1D1F] text-sm mb-0.5 group-hover:text-[#4F46E5] transition-colors">
                    {m.label}
                  </p>
                  <p className="font-bold text-sm" style={{ color: m.color }}>
                    {m.value}
                  </p>
                  <p className="text-[#AEAEB2] text-xs mt-0.5">{m.sub}</p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ MAIN CONTENT ══════════════════════ */}
      <section className="py-14 md:py-20 bg-[#F5F5F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Left: Contact Info ── */}
            <div className="lg:col-span-2">
              <ScrollReveal direction="left">
                <div
                  className="relative overflow-hidden rounded-3xl p-8 text-white h-full noise-overlay"
                  style={{
                    background: "linear-gradient(135deg, #1a0a3e 0%, #0f0c29 50%, #060d1e 100%)",
                  }}
                >
                  <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #4F46E5, transparent)" }}
                  />
                  <div
                    className="absolute bottom-0 left-0 w-36 h-36 rounded-full blur-3xl opacity-15 pointer-events-none"
                    style={{ background: "radial-gradient(circle, #0EA5E9, transparent)" }}
                  />

                  <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-1">Contact Information</h2>
                    <p className="text-white/60 text-sm mb-8">
                      Our counselors are available all hours, every day.
                    </p>

                    <div className="space-y-5">
                      {[
                        {
                          Icon: Phone,
                          title: "Phone / WhatsApp",
                          lines: ["+91 70347 60995"],
                        },
                        {
                          Icon: Mail,
                          title: "Email",
                          lines: ["info@vidyavasal.com", "admissions@vidyavasal.com"],
                        },
                        {
                          Icon: MapPin,
                          title: "Office Address",
                          lines: [
                            "Institute of Distance Education",
                            "Manathavady, Kerala, India — PIN 670645",
                          ],
                        },
                        {
                          Icon: Clock,
                          title: "Working Hours",
                          lines: ["Open All Hours · 7 Days a Week"],
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-white">
                            <item.Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                            {item.lines.map((l) => (
                              <p key={l} className="text-white/60 text-sm leading-relaxed">
                                {l}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href="https://wa.me/917034760995"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1ebe57] transition-colors font-semibold text-sm text-white"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Chat on WhatsApp Now
                    </a>

                    {/* Social icons */}
                    <div className="mt-6 flex gap-3">
                      {[
                        {
                          label: "Instagram",
                          href: "https://www.instagram.com/vidya.vasal",
                          icon: (
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          ),
                        },
                        {
                          label: "Facebook",
                          href: "https://www.facebook.com/vidyavasal",
                          icon: (
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          ),
                        },
                      ].map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={s.label}
                          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            {s.icon}
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

<<<<<<< HEAD
            {/* ── Right: Contact Form ── */}
            <div className="lg:col-span-3">
              <ScrollReveal direction="right">
                <ContactForm />
              </ScrollReveal>
=======
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-[#E5E5EA] shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-[#1D1D1F]">Send us a Message</h2>
              <form className="space-y-5" action={submitContactForm}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Full Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]" placeholder="John Doe" />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Phone Number (WhatsApp)</label>
                  <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all placeholder:text-[#AEAEB2]" placeholder="+91 XXXXX XXXXX" />
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Interested Course</label>
                  <select id="course" name="course" className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all">
                    <option value="">Select a program...</option>
                    <option value="online-degree">Online University Degree (MBA, BBA, BCA…)</option>
                    <option value="iits">IITS Distance Education</option>
                    <option value="eduthalim">Eduthalim Degree/10th/12th</option>
                    <option value="montessori">Montessori Counseling</option>
                    <option value="other">Other / Not Sure</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#1D1D1F] mb-1.5">Message</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-4 py-3 rounded-xl border border-[#E5E5EA] bg-white text-[#1D1D1F] focus:ring-2 focus:ring-[#007AFF]/15 focus:border-[#007AFF] outline-none transition-all resize-none placeholder:text-[#AEAEB2]" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" className="w-full bg-[#007AFF] text-white font-semibold py-4 rounded-xl hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 btn-press">
                  Submit Enquiry
                </button>
              </form>
>>>>>>> feat/university-course-experience
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ WHY CONTACT US ══════════════════════ */}
      <section className="section-y bg-[#F5F5F7]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <ScrollReveal className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F]">
              Why reach out to <span className="text-accent">Vidyavasal?</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {reasons.map((r, i) => (
              <ScrollReveal key={r.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-6 border border-[#E5E5EA] card-hover text-center">
                  <span className="w-12 h-12 rounded-xl bg-[#F0EBFF] text-[#4F46E5] flex items-center justify-center mx-auto mb-3">
                    <r.Icon className="w-6 h-6" />
                  </span>
                  <h3 className="font-bold text-[#1D1D1F] text-sm mb-1.5">{r.title}</h3>
                  <p className="text-[#6E6E73] text-xs leading-relaxed">{r.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
