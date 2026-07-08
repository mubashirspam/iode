import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Vidyavasal",
  description:
    "Read the Terms of Service for Vidyavasal's admission counseling and university guidance services.",
};

export default function TermsPage() {
  return (
    <div>
      <section className="bg-[#F5F5F7] pt-12 pb-4 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <p className="text-sm text-[#7B61FF] font-semibold mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-[#1D1D1F]">Terms of Service</h1>
          <p className="text-[#6E6E73] mt-3">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <p className="text-[#6E6E73]">
              Please read these Terms of Service carefully before using the Vidyavasal website or
              any of our counseling services. By accessing our website or submitting an enquiry,
              you agree to be bound by these terms.
            </p>

            {/* ── 1. About Vidyavasal ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">1. About Vidyavasal</h2>
            <p className="text-[#6E6E73]">
              Vidyavasal is an admission counseling and education guidance service based in
              Manathavady, Kerala, India. We help students and working professionals explore
              university programs, understand eligibility requirements, and navigate the
              admission process.
            </p>
            <p className="text-[#6E6E73] mt-4">
              <strong>Vidyavasal is not a university, college, or any academic institution.</strong>{" "}
              We are an independent intermediary service that connects prospective students with
              universities and programs that may suit their needs.
            </p>

            {/* ── 2. Our Services ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">2. Our Services</h2>
            <p className="text-[#6E6E73]">Vidyavasal provides the following services:</p>
            <ul className="text-[#6E6E73] space-y-2 list-disc pl-6">
              <li>
                <strong>Admission Guidance:</strong> We advise students on selecting suitable
                universities and programs based on their academic background, goals, and preferences.
              </li>
              <li>
                <strong>Admission Process Support:</strong> We guide students through the steps
                required to apply to a university — including understanding application requirements,
                document preparation, and form submission.
              </li>
              <li>
                <strong>Counseling:</strong> We provide free one-on-one counseling sessions (via
                phone, WhatsApp, or in-person) to help students make informed decisions.
              </li>
              <li>
                <strong>Information:</strong> We share publicly available information about
                universities, courses, fees, and eligibility criteria to help students research
                their options.
              </li>
            </ul>

            {/* ── 3. What Vidyavasal Does Not Control ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              3. What Vidyavasal Does Not Control
            </h2>
            <p className="text-[#6E6E73]">
              All matters beyond admission guidance are entirely governed by the respective
              university, college, or program institution. This includes, but is not limited to:
            </p>
            <ul className="text-[#6E6E73] space-y-2 list-disc pl-6">
              <li>Course fees, fee revisions, and payment schedules</li>
              <li>Eligibility criteria and academic requirements</li>
              <li>Admission approval or rejection decisions</li>
              <li>Program structure, curriculum, and course content</li>
              <li>Exam patterns, assessment methods, and grading</li>
              <li>Scholarship, fee concession, and financial aid policies</li>
              <li>Hostel, campus, and infrastructure facilities</li>
              <li>Certificate, degree, or diploma issuance</li>
              <li>University accreditations and regulatory approvals</li>
              <li>Any changes to policies, programs, or fee structures</li>
            </ul>
            <p className="text-[#6E6E73] mt-4">
              Vidyavasal does not make any decisions on behalf of any university or institution.
              Any information we share about a university is based on publicly available details
              and is subject to change without notice at the university's discretion.
            </p>

            {/* ── 4. No Admission Guarantee ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              4. No Guarantee of Admission
            </h2>
            <p className="text-[#6E6E73]">
              Vidyavasal provides guidance and support — we do <strong>not</strong> guarantee
              admission to any university or program. Final admission decisions rest solely with
              the respective university or institution. We are not liable for any rejection,
              delay, or change in admission status.
            </p>

            {/* ── 5. Accuracy of Information ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              5. Accuracy of Information
            </h2>
            <p className="text-[#6E6E73]">
              We make every effort to keep the information on our website accurate and up to date.
              However, university fees, eligibility criteria, program details, and other
              information are set by the respective institutions and can change at any time.
              Always verify current details directly with the university or institution before
              making any decision.
            </p>

            {/* ── 6. Free Counseling ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              6. Free Counseling
            </h2>
            <p className="text-[#6E6E73]">
              Our admission counseling and guidance service is provided <strong>free of charge</strong>{" "}
              to students. We do not charge students for counseling sessions, enquiry submissions,
              or general guidance. Any fees related to university applications, program enrollment,
              or document processing are charged directly by the respective institution.
            </p>

            {/* ── 7. User Responsibilities ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              7. Your Responsibilities
            </h2>
            <p className="text-[#6E6E73]">When using our services, you agree to:</p>
            <ul className="text-[#6E6E73] space-y-1 list-disc pl-6">
              <li>Provide accurate and truthful information in all enquiry forms</li>
              <li>Verify all university-related details directly with the institution</li>
              <li>Make your own informed decisions regarding admissions</li>
              <li>Not misuse our platform for spam or fraudulent purposes</li>
            </ul>

            {/* ── 8. Limitation of Liability ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              8. Limitation of Liability
            </h2>
            <p className="text-[#6E6E73]">
              Vidyavasal shall not be held liable for any losses, damages, or inconveniences
              arising from:
            </p>
            <ul className="text-[#6E6E73] space-y-1 list-disc pl-6">
              <li>Decisions made by any university or institution</li>
              <li>Changes in fees, eligibility, or program structure by a university</li>
              <li>Admission rejections or cancellations by any institution</li>
              <li>Reliance on information that has changed after publication on our site</li>
              <li>Any disputes between you and a university or program provider</li>
            </ul>

            {/* ── 9. Third-Party Links ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              9. Third-Party Links
            </h2>
            <p className="text-[#6E6E73]">
              Our website may contain links to university websites and external resources.
              These are provided for your convenience only. Vidyavasal has no control over the
              content or policies of external websites and is not responsible for them.
            </p>

            {/* ── 10. Changes to Terms ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              10. Changes to These Terms
            </h2>
            <p className="text-[#6E6E73]">
              We reserve the right to update these Terms of Service at any time. Changes will be
              posted on this page with a revised date. Continued use of our services after any
              update constitutes your acceptance of the new terms.
            </p>

            {/* ── 11. Governing Law ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">
              11. Governing Law
            </h2>
            <p className="text-[#6E6E73]">
              These Terms are governed by the laws of India. Any disputes shall be subject to
              the jurisdiction of the courts in Kerala, India.
            </p>

            {/* ── 12. Contact ── */}
            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">12. Contact Us</h2>
            <p className="text-[#6E6E73]">
              For any questions regarding these Terms of Service, please contact us:
            </p>
            <ul className="text-[#6E6E73] space-y-1 list-none pl-0">
              <li><strong>Vidyavasal — Institute of Distance Education</strong></li>
              <li>Manathavady, Kerala, India — PIN 670645</li>
              <li>Email: <a href="mailto:info@vidyavasal.com" className="text-[#4F46E5] underline">info@vidyavasal.com</a></li>
              <li>Phone / WhatsApp: <a href="tel:+917034760995" className="text-[#4F46E5] underline">+91 70347 60995</a></li>
            </ul>

            <div className="mt-10 pt-8 border-t border-[#E5E5EA]">
              <p className="text-sm text-[#AEAEB2]">
                Also see our{" "}
                <Link href="/privacy-policy" className="text-[#4F46E5] underline">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
