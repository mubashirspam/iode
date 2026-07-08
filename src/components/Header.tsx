'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 glass-effect transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5AC8FA] flex items-center justify-center text-white font-bold text-base shadow-md group-hover:shadow-lg group-hover:shadow-[#007AFF]/20 transition-shadow">
            I
          </div>
          <span className="font-bold text-[1.15rem] tracking-tight text-[#1D1D1F]">
            IODE
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 font-medium text-[0.9rem] text-[#6E6E73]">
          <Link href="/" className="relative py-1 hover:text-[#1D1D1F] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#007AFF] after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            Home
          </Link>
          <Link href="/about" className="relative py-1 hover:text-[#1D1D1F] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#007AFF] after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            About
          </Link>
          <div className="relative group cursor-pointer">
            <span className="relative py-1 hover:text-[#1D1D1F] transition-colors duration-200 flex items-center gap-1">
              Programs
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-xl shadow-black/8 border border-[#E5E5EA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden p-1.5">
              <Link href="/universities" className="px-4 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] text-sm">Online Degrees</Link>
              <Link href="/iits" className="px-4 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] text-sm">IITS Distance</Link>
              <Link href="/eduthalim" className="px-4 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] text-sm">Eduthalim Degree</Link>
              <Link href="/montessori" className="px-4 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] text-sm">Montessori</Link>
              <div className="h-px bg-[#E5E5EA] my-1 mx-2"></div>
              <Link href="/courses" className="px-4 py-2.5 rounded-xl hover:bg-[#E8F2FF] transition-colors text-[#007AFF] text-sm font-semibold">All Courses →</Link>
            </div>
          </div>
          <Link href="/universities" className="relative py-1 hover:text-[#1D1D1F] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#007AFF] after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            Universities
          </Link>
          <Link href="/blog" className="relative py-1 hover:text-[#1D1D1F] transition-colors duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#007AFF] after:rounded-full hover:after:w-full after:transition-all after:duration-300">
            Blog
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden sm:flex items-center justify-center px-5 py-2.5 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-all duration-200 shadow-md shadow-[#007AFF]/20 hover:shadow-lg hover:shadow-[#007AFF]/30 btn-press gap-2">
            Enquire Now
            <svg className="w-4 h-4 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-[#E5E5EA] bg-white/98 backdrop-blur-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] font-medium">
              Home
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] font-medium">
              About
            </Link>

            <div className="px-4 py-2 text-xs font-semibold text-[#AEAEB2] uppercase tracking-wider">Programs</div>
            <Link href="/universities" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 pl-6 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#6E6E73]">
              Online Degrees (Universities)
            </Link>
            <Link href="/iits" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 pl-6 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#6E6E73]">
              IITS Distance
            </Link>
            <Link href="/eduthalim" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 pl-6 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#6E6E73]">
              Eduthalim Degree
            </Link>
            <Link href="/montessori" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 pl-6 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#6E6E73]">
              Montessori
            </Link>
            <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 pl-6 rounded-xl hover:bg-[#E8F2FF] transition-colors text-[#007AFF] font-semibold">
              All Courses →
            </Link>

            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl hover:bg-[#F5F5F7] transition-colors text-[#1D1D1F] font-medium">
              Blog
            </Link>

            <div className="pt-3 mt-2 border-t border-[#E5E5EA]">
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#007AFF] text-white font-semibold text-sm hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 btn-press">
                Enquire Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
