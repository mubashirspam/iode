import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { getUniversities, getCourses } from '@/lib/db/queries';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Dynamic link columns — keeps the footer fresh and adds internal links that
  // help universities/courses get crawled and indexed (better SEO).
  const [universities, courses] = await Promise.all([
    getUniversities().catch(() => []),
    getCourses().catch(() => []),
  ]);

  const topUniversities = universities.filter((u) => u.slug).slice(0, 6);
  const popularCourses = courses
    .filter((c) => c.slug && c.universitySlug)
    .slice(0, 6);

  return (
    <footer className="bg-white border-t border-[#E5E5EA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-12 md:gap-10 mb-10">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-3 space-y-4">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Vidyavasal — Learn Anywhere. Grow Everywhere."
                width={200}
                height={53}
                className="h-[60px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-[#6E6E73] leading-relaxed max-w-[280px]">
              Empowering students and working professionals across Kerala and India with
              quality university admissions and UGC-recognized distance &amp; online
              education — guided end to end, from counselling to enrollment.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="https://www.instagram.com/vidya.vasal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8F2FF] flex items-center justify-center text-[#6E6E73] hover:text-[#007AFF] transition-all" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.facebook.com/vidyavasal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8F2FF] flex items-center justify-center text-[#6E6E73] hover:text-[#007AFF] transition-all" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://wa.me/917034760995" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#E8F2FF] flex items-center justify-center text-[#6E6E73] hover:text-[#007AFF] transition-all" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          {/* Top Universities (dynamic) */}
          <div className="lg:col-span-3">
            <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Top Universities</h4>
            <ul className="space-y-3 text-sm">
              {topUniversities.map((u) => (
                <li key={u.id}>
                  <Link href={`/universities/${u.slug}`} className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">
                    {u.shortName ?? u.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/universities" className="inline-flex items-center gap-1 font-semibold text-[#4F46E5] hover:text-[#7C3AED] transition-colors">
                  All universities
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Courses (dynamic) */}
          <div className="lg:col-span-3">
            <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Popular Courses</h4>
            <ul className="space-y-3 text-sm">
              {popularCourses.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/universities/${c.universitySlug}/${c.slug}`}
                    className="text-[#6E6E73] hover:text-[#007AFF] transition-colors line-clamp-1"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/courses" className="inline-flex items-center gap-1 font-semibold text-[#4F46E5] hover:text-[#7C3AED] transition-colors">
                  Browse all courses
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company + Connect */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">About Us</Link></li>
                <li><Link href="/admissions" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">Admissions</Link></li>
                <li><Link href="/montessori" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">Montessori</Link></li>
                <li><Link href="/blog" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#1D1D1F] font-semibold text-sm mb-4">Connect</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#7B61FF] mt-0.5 shrink-0" />
                  <span className="text-[#6E6E73]">Kerala, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#7B61FF] shrink-0" />
                  <a href="mailto:info@vidyavasal.com" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">info@vidyavasal.com</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#7B61FF] shrink-0" />
                  <a href="tel:+917034760995" className="text-[#6E6E73] hover:text-[#007AFF] transition-colors">+91 70347 60995</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO content + popular searches */}
        <div className="rounded-2xl border border-[#ECE9FB] bg-[#FAF9FF] p-5 sm:p-6 mb-10">
          <p className="text-xs leading-relaxed text-[#8A8A8E]">
            Vidyavasal is a trusted education consultancy helping students across Kerala
            and India enroll in UGC-DEB recognized online and distance learning programs —
            BBA, BCA, B.Com, MBA, MCA, M.Com and more — from leading universities such as
            {topUniversities.length > 0 ? ` ${topUniversities.map((u) => u.shortName ?? u.name).join(", ")}` : " India's top institutions"}.
            We offer free counselling, eligibility checks, scholarship guidance and end-to-end
            admission support so you can study from anywhere and grow everywhere.
          </p>
          {popularCourses.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {popularCourses.map((c) => (
                <Link
                  key={`tag-${c.id}`}
                  href={`/universities/${c.universitySlug}/${c.slug}`}
                  className="rounded-full border border-[#E5E0F7] bg-white px-3 py-1 text-xs font-medium text-[#6E6E73] transition-colors hover:border-[#C4B5FD] hover:text-[#4F46E5]"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E5E5EA] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#AEAEB2]">
          <p>&copy; {currentYear} Vidyavasal. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-[#007AFF] transition-colors">Privacy Policy</Link>
            <span className="text-[#E5E5EA]">|</span>
            <Link href="/terms" className="hover:text-[#007AFF] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
