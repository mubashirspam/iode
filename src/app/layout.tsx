import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteShell from "@/components/SiteShell";
import { SITE_URL, IS_INDEXABLE } from "@/lib/seo/site";
import { organizationLd, webSiteLd } from "@/lib/seo/jsonld";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTracker from "@/components/PageTracker";
import CookieConsent from "@/components/CookieConsent";
import LeadFormFab from "@/components/LeadFormFab";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Vidyavasal - University Admissions & Distance Education",
    default: "Vidyavasal - University Admissions & Distance Education | Kerala's Leading Ed-Tech",
  },
  alternates: { canonical: "/" },
  description: "Vidyavasal helps students get admitted to top universities across India. Expert guidance for distance education, +1, +2, UG, PG, MBA admissions and courses. Based in Kerala.",
  keywords: ["university admissions", "distance education", "MBA Kerala", "UG PG admissions", "+1 +2 Kerala", "IGNOU admission", "online degree India", "Vidyavasal"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Vidyavasal",
    title: "Vidyavasal - University Admissions & Distance Education | Kerala",
    description: "Expert guidance for university admissions, distance education, and courses across India. 5,000+ students enrolled.",
    locale: "en_IN",
    images: [
      {
        url: "/poster.jpg",
        width: 1024,
        height: 1280,
        alt: "Vidyavasal — Online Degree. Learn Anywhere. Grow Everywhere.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyavasal - University Admissions & Distance Education",
    description: "Expert guidance for university admissions and distance education across India.",
    images: ["/poster.jpg"],
  },
  // Driven by env so only the production domain is indexable; staging is noindex.
  robots: {
    index: IS_INDEXABLE,
    follow: IS_INDEXABLE,
    googleBot: {
      index: IS_INDEXABLE,
      follow: IS_INDEXABLE,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const siteJsonLd = [organizationLd(), webSiteLd()];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full antialiased scroll-smooth`}>
      <head>
        {/* Preconnect to the image CDN — banner images are the LCP element */}
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {siteJsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#1D1D1F]">
        <SiteShell
          header={
            <div className="print:hidden">
              <Header />
            </div>
          }
          footer={
            <div className="print:hidden">
              <Footer />
            </div>
          }
        >
          {children}
        </SiteShell>
        <PageTracker />
        <LeadFormFab />
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
      {/* GA4 — production only, when a measurement id is configured */}
      {IS_INDEXABLE && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
