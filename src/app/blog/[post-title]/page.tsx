import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{ "post-title": string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const postTitle = params["post-title"].replace(/-/g, " ");

  return {
    title: `${postTitle} | Vidyavasal Blog`,
    description: `Read our latest article about ${postTitle}.`,
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const postTitle = params["post-title"].replace(/-/g, " ");

  return (
    <div>
      <section className="bg-[#F5F5F7] pt-12 pb-4 md:pt-20 md:pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link href="/blog" className="text-[#007AFF] hover:underline flex items-center gap-2 mb-8 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to all articles
          </Link>
          <span className="text-[#AEAEB2] text-sm font-medium mb-4 block">Published recently</span>
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#1D1D1F] capitalize leading-tight">
            {postTitle}
          </h1>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="prose prose-lg max-w-none text-[#6E6E73]">
            <p className="text-xl mb-8 text-[#1D1D1F] font-medium leading-relaxed">
              This is a detailed article discussing the various aspects of {postTitle}.
            </p>
            <p className="mb-6">
              Education is a continuous journey. Distance education provides a way for working professionals and students to achieve their academic goals without compromising their current commitments.
            </p>
            <h2 className="text-2xl font-bold text-[#1D1D1F] mt-10 mb-4">Key Takeaways</h2>
            <ul className="list-disc pl-6 mb-8 space-y-2">
              <li>Flexibility in learning schedules</li>
              <li>Cost-effective education options</li>
              <li>Access to diverse programs and expert faculty</li>
              <li>Improved career prospects and skill development</li>
            </ul>
            <p>
              For more information on our programs, please feel free to reach out to our counselors who are ready to guide you towards the right path.
            </p>

            <div className="mt-12 pt-8 border-t border-[#E5E5EA]">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#007AFF] text-white font-bold text-base hover:bg-[#0066D6] transition-colors shadow-md shadow-[#007AFF]/20 text-center btn-press">
                Speak to an Advisor
                <svg className="w-5 h-5 cta-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
