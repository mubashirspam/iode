import { Metadata } from "next";
import { submitContactForm } from "@/lib/actions/leads";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with IODE for admissions, counseling, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#F0F7FF] to-white pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <span className="section-label mb-5 inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mt-3 mb-4 leading-tight">Contact Us</h1>
          <p className="text-lg text-[#6E6E73]">We&apos;re here to help you take the next step in your educational journey.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="bg-gradient-to-br from-[#007AFF] to-[#0055CC] rounded-2xl p-8 md:p-10 text-white shadow-xl shadow-[#007AFF]/15 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-8">Get In Touch</h2>

                <div className="space-y-7">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">Phone / WhatsApp</h3>
                      <p className="text-blue-100 text-sm">+91 00000 00000</p>
                      <p className="text-blue-100 text-sm">+91 11111 11111</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">Email</h3>
                      <p className="text-blue-100 text-sm">info@iodeedu.in</p>
                      <p className="text-blue-100 text-sm">admissions@iodeedu.in</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">Office Address</h3>
                      <p className="text-blue-100 text-sm">Institute of Distance Education<br />Kerala, India<br />PIN - 680000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
