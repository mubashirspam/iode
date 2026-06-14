import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

/**
 * Blog-grade markdown renderer. The project has no Tailwind typography plugin,
 * so every element is styled explicitly here for a polished, consistent look.
 *
 * `rehypeRaw` is enabled so admin-authored brochure content (trusted, written
 * only in the tracker panel) may embed sized image figures, e.g.
 *   <figure class="md-figure md-figure--medium"><img …/><figcaption>…</figcaption></figure>
 */
const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-12 mb-4 scroll-mt-28 text-2xl font-extrabold tracking-tight text-[#1D1D1F] md:text-3xl">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 scroll-mt-28 border-l-4 border-[#7C3AED] pl-3 text-xl font-extrabold tracking-tight text-[#1D1D1F] md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 scroll-mt-28 text-lg font-bold text-[#1D1D1F] md:text-xl">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 text-base font-bold text-[#1D1D1F]">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="my-4 text-[15px] leading-[1.8] text-[#3A3A3C]">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="font-medium text-[#4F46E5] underline decoration-[#4F46E5]/30 underline-offset-2 transition-colors hover:decoration-[#4F46E5]"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-5 marker:text-[#7C3AED]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-[#7C3AED]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-[15px] leading-relaxed text-[#3A3A3C]">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-r-xl border-l-4 border-[#7C3AED] bg-[#F6F4FF] py-3 pl-5 pr-4 text-[#5B21B6] italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-t border-[#ECE9FB]" />,
  strong: ({ children }) => (
    <strong className="font-bold text-[#1D1D1F]">{children}</strong>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-[#F5F3FF] px-1.5 py-0.5 text-[0.85em] font-medium text-[#7C3AED]">
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-[#ECE9FB]">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#F6F4FF] text-[#4F46E5]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border-b border-[#ECE9FB] px-4 py-2.5 font-semibold">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[#F1EEFC] px-4 py-2.5 text-[#3A3A3C]">{children}</td>
  ),
  figure: ({ children, className }) => (
    <figure className={`my-7 ${className ?? ""}`}>{children}</figure>
  ),
  figcaption: ({ children }) => (
    <figcaption className="mt-2 text-center text-xs text-[#9A98A3]">{children}</figcaption>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt ?? ""}
      loading="lazy"
      className="mx-auto h-auto w-full rounded-2xl border border-[#ECE9FB] object-cover shadow-sm"
    />
  ),
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="article-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
