'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Landmark, GraduationCap } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  // On the courses page only, hide the navbar when scrolling down (so the sticky
  // filter bar becomes the top bar) and reveal it again on scroll up.
  const hideOnScroll = pathname === '/courses';
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);

      if (hideOnScroll && !mobileMenuOpen) {
        if (y > 140 && y > lastY.current) setHidden(true);
        else if (y < lastY.current) setHidden(false);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, mobileMenuOpen]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4 pointer-events-none transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-[130%]' : 'translate-y-0'
      }`}
    >
      <div
        className={`pointer-events-auto mx-auto max-w-6xl transition-all duration-300 ${
          mobileMenuOpen ? 'rounded-3xl' : 'rounded-full'
        } ${
          scrolled
            ? 'bg-white/90 backdrop-blur-2xl shadow-lg shadow-black/[0.06] border border-[#E5E5EA]'
            : 'bg-white/70 backdrop-blur-xl shadow-md shadow-black/[0.04] border border-white/60'
        }`}
      >
        <div className="px-5 sm:px-7 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src="/logo.svg"
            alt="Vidyavasal — Learn Anywhere. Grow Everywhere."
            width={30}
            height={30}
           className="h-[30px] w-auto object-contain group-hover:opacity-90 transition-opacity"
            priority
          />
          <span className="font-poppins text-[#1D1D1F] font-semibold text-xl tracking-tight">
            vidyavasal
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-6 font-medium text-[0.9rem] text-[#6E6E73]">
          {[
            { href: '/', label: 'Home' },
            { href: '/about', label: 'About' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
                isActive(link.href)
                  ? 'text-[#4F46E5] after:w-full after:bg-gradient-to-r after:from-[#4F46E5] after:to-[#0EA5E9]'
                  : 'hover:text-[#1D1D1F] after:w-0 after:bg-[#4F46E5] hover:after:w-full'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Programs dropdown */}
          <div className="relative group cursor-pointer">
            <span
              className={`relative py-1 transition-colors duration-200 flex items-center gap-1 ${
                ['/admissions', '/montessori'].some((p) => pathname.startsWith(p))
                  ? 'text-[#4F46E5]'
                  : 'hover:text-[#1D1D1F]'
              }`}
            >
              Programs
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-white rounded-2xl shadow-xl shadow-black/8 border border-[#E5E5EA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden p-1.5">
              {[
                {
                  href: '/admissions',
                  label: 'University Admissions',
                  color: 'from-[#4F46E5] to-[#7C3AED]',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
                },
                {
                  href: '/montessori',
                  label: 'Montessori',
                  color: 'from-[#10B981] to-[#059669]',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] text-sm flex items-center gap-2.5 ${
                    isActive(item.href) ? 'bg-[#F5F5F7]' : ''
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </span>
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#E5E5EA] my-1 mx-2" />
              <Link
                href="/courses"
                className="px-4 py-2.5 rounded-xl hover:bg-[#EEF2FF] transition-colors text-[#4F46E5] text-sm font-semibold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse All Courses →
              </Link>
            </div>
          </div>

          <Link
            href="/universities"
            className={`relative py-1 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
              isActive('/universities')
                ? 'text-[#4F46E5] after:w-full after:bg-gradient-to-r after:from-[#4F46E5] after:to-[#0EA5E9]'
                : 'hover:text-[#1D1D1F] after:w-0 after:bg-[#4F46E5] hover:after:w-full'
            }`}
          >
            Universities
          </Link>

          <Link
            href="/blog"
            className={`relative py-1 transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
              isActive('/blog')
                ? 'text-[#4F46E5] after:w-full after:bg-gradient-to-r after:from-[#4F46E5] after:to-[#0EA5E9]'
                : 'hover:text-[#1D1D1F] after:w-0 after:bg-[#4F46E5] hover:after:w-full'
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white font-semibold text-sm btn-press gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            Enquire Now
            <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-[#E5E5EA] rounded-b-2xl overflow-hidden">
          <nav className="px-3 py-4 flex flex-col gap-1">
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/universities', label: 'Universities' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive(link.href)
                    ? 'bg-[#EEF2FF] text-[#4F46E5]'
                    : 'hover:bg-[#F5F5F7] text-[#1D1D1F]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 py-2 text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">
              Programs
            </div>

            {[
              { href: '/admissions', label: 'University Admissions', grad: 'from-[#4F46E5] to-[#7C3AED]', Icon: Landmark },
              { href: '/montessori', label: 'Montessori', grad: 'from-[#10B981] to-[#059669]', Icon: GraduationCap },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 pl-6 rounded-xl transition-colors flex items-center gap-3 ${
                  isActive(item.href)
                    ? 'bg-[#EEF2FF] text-[#4F46E5]'
                    : 'hover:bg-[#F5F5F7] text-[#6E6E73]'
                }`}
              >
                <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.grad} flex items-center justify-center`}>
                  <item.Icon className="w-4 h-4 text-white" />
                </span>
                {item.label}
              </Link>
            ))}

            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 pl-6 rounded-xl hover:bg-[#EEF2FF] transition-colors text-[#4F46E5] font-semibold"
            >
              Browse All Courses →
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-xl transition-colors font-medium ${
                isActive('/blog')
                  ? 'bg-[#EEF2FF] text-[#4F46E5]'
                  : 'hover:bg-[#F5F5F7] text-[#1D1D1F]'
              }`}
            >
              Blog
            </Link>

            <div className="pt-3 mt-2 border-t border-[#E5E5EA]">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full btn-gradient-vivid text-white font-semibold text-sm btn-press"
              >
                Enquire Now — It&apos;s Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
      </div>
    </header>
  );
}
