import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ "course-name": string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const courseName = params["course-name"].replace(/-/g, " ").toUpperCase();

  return {
    title: `${courseName} | Vidyavasal Courses`,
    description: `Learn more about the ${courseName} program at Vidyavasal.`,
  };
}

export default async function CourseDetailPage(props: Props) {
  const params = await props.params;
  const courseName = params["course-name"].replace(/-/g, " ").toUpperCase();

  return (
    <div>
      <section className="bg-[#F5F5F7] pt-12 pb-4 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Link href="/courses" className="text-[#007AFF] hover:underline flex items-center gap-2 mb-6 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to all courses
          </Link>
          <span className="inline-block px-3 py-1 bg-[#E8F2FF] text-[#007AFF] text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Program Details
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#1D1D1F]">{courseName}</h1>
          <p className="text-lg text-[#6E6E73]">
            Advance your career with our comprehensive {courseName} program designed for modern professionals.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E5EA] shadow-sm mb-12">
            <h2 className="text-2xl font-bold mb-6 text-[#1D1D1F]">Program Overview</h2>
            <p className="text-[#6E6E73] mb-8 leading-relaxed">
              Detailed information about syllabus, eligibility criteria, and duration will be updated here. This program is structured to provide in-depth knowledge and practical skills required in today&apos;s competitive landscape.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#007AFF] text-white font-bold text-base hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 text-center w-full sm:w-auto justify-center btn-press">
              Enquire About This Course
              <svg className="w-5 h-5 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
