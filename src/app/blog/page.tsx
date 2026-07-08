import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read the latest news, educational tips, and updates from Vidyavasal.",
};

export default function BlogPage() {
  const posts = [
    { id: "benefits-of-distance-education", title: "5 Benefits of Distance Education for Working Professionals", date: "May 20, 2026", category: "Education" },
    { id: "montessori-career", title: "Why Choose a Career in Montessori Teaching?", date: "May 15, 2026", category: "Career" },
    { id: "time-management-tips", title: "Effective Time Management Tips for Online Learners", date: "May 10, 2026", category: "Tips & Guides" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#F5F5F7] pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <span className="section-label mb-5 inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            Latest Articles
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mt-3 mb-4 leading-tight">Vidyavasal Blog</h1>
          <p className="text-lg text-[#6E6E73]">Insights, updates, and educational guides.</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link href={`/blog/${post.id}`} key={post.id} className="block group">
                <div className="bg-white rounded-2xl p-7 border border-[#E5E5EA] card-hover h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-3 py-1 bg-[#E8F2FF] text-[#007AFF] text-xs font-semibold rounded-full">{post.category}</span>
                    <span className="text-[#AEAEB2] text-xs">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 group-hover:text-[#007AFF] transition-colors leading-tight">{post.title}</h3>
                  <p className="text-[#6E6E73] mb-5 text-sm leading-relaxed flex-grow">Read more about how this impacts your educational journey and career prospects.</p>
                  <div className="text-[#007AFF] font-semibold text-sm flex items-center gap-2 mt-auto">
                    Read Article <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
