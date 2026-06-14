import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Vidyavasal",
  description:
    "Learn how Vidyavasal collects, uses, and protects your personal information when you use our admission counseling services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-[#F0F7FF] to-white pt-12 pb-4 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <p className="text-sm text-[#7B61FF] font-semibold mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-[#1D1D1F]">Privacy Policy</h1>
          <p className="text-[#6E6E73] mt-3">Last updated: June 2026</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            <p className="text-[#6E6E73]">
              Vidyavasal ("we", "us", or "our") operates as an admission guidance and counseling
              platform. This Privacy Policy explains what personal information we collect, how we
              use it, and your rights regarding that information. By using our website or submitting
              an enquiry, you agree to this policy.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">1. Who We Are</h2>
            <p className="text-[#6E6E73]">
              Vidyavasal is an education counseling service based in Manathavady, Kerala, India
              (PIN 670645). We assist students and working professionals in finding suitable
              universities and programs and guide them through the admission process. We are
              not a university, college, or academic institution — we are an intermediary
              counseling and support service.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">2. Information We Collect</h2>
            <p className="text-[#6E6E73]">We collect information you voluntarily provide to us, including:</p>
            <ul className="text-[#6E6E73] space-y-1 list-disc pl-6">
              <li>Full name</li>
              <li>Mobile number / WhatsApp number</li>
              <li>Email address</li>
              <li>Educational qualification or current level of study</li>
              <li>Program or university preference</li>
              <li>Any message or question you share with us</li>
            </ul>
            <p className="text-[#6E6E73] mt-4">
              We may also automatically collect basic usage data such as pages visited, browser
              type, and referral source to improve our services. We use cookies for session
              management and analytics only.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">3. How We Use Your Information</h2>
            <p className="text-[#6E6E73]">We use your personal information to:</p>
            <ul className="text-[#6E6E73] space-y-1 list-disc pl-6">
              <li>Contact you to provide admission guidance and counseling</li>
              <li>Recommend suitable universities or programs based on your profile</li>
              <li>Assist you through the admission enquiry and application process</li>
              <li>Send relevant information about programs, fees, and eligibility</li>
              <li>Improve our website and services</li>
              <li>Respond to your queries via phone, WhatsApp, or email</li>
            </ul>
            <p className="text-[#6E6E73] mt-4">
              We do <strong>not</strong> sell, rent, or trade your personal information to any
              third party for marketing purposes.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">4. Sharing of Information</h2>
            <p className="text-[#6E6E73]">
              In the course of helping you with admissions, we may share limited information
              (such as your name, phone, and program interest) with the relevant university or
              institution you wish to apply to — solely for the purpose of facilitating your
              admission enquiry. This sharing is done with your implied consent when you submit
              an enquiry through our platform.
            </p>
            <p className="text-[#6E6E73] mt-4">
              All decisions, requirements, and policies of those universities or programs are
              governed entirely by those institutions. Vidyavasal is not responsible for how
              third-party institutions handle your information after it is forwarded at your request.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">5. Data Retention</h2>
            <p className="text-[#6E6E73]">
              We retain your information for as long as necessary to provide counseling services
              and for legitimate business purposes. You may request deletion of your data at any
              time by contacting us at{" "}
              <a href="mailto:info@vidyavasal.com" className="text-[#4F46E5] underline">
                info@vidyavasal.com
              </a>.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">6. Security</h2>
            <p className="text-[#6E6E73]">
              We take reasonable technical and organizational measures to protect your personal
              information from unauthorized access, loss, or misuse. However, no method of
              internet transmission is 100% secure.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">7. Your Rights</h2>
            <p className="text-[#6E6E73]">You have the right to:</p>
            <ul className="text-[#6E6E73] space-y-1 list-disc pl-6">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for us to contact you at any time</li>
            </ul>
            <p className="text-[#6E6E73] mt-4">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:info@vidyavasal.com" className="text-[#4F46E5] underline">
                info@vidyavasal.com
              </a>{" "}
              or call <a href="tel:+917034760995" className="text-[#4F46E5] underline">+91 70347 60995</a>.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">8. Changes to This Policy</h2>
            <p className="text-[#6E6E73]">
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with a revised date. Continued use of our services after changes
              constitutes acceptance of the updated policy.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-[#1D1D1F]">9. Contact Us</h2>
            <p className="text-[#6E6E73]">
              If you have any questions about this Privacy Policy, please contact us:
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
                <Link href="/terms" className="text-[#4F46E5] underline">Terms of Service</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
