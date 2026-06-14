import type { ReactNode } from "react";

type Props = {
  /** Small uppercase eyebrow label shown in the pill. */
  eyebrow: string;
  /** Main heading — pass JSX so you can wrap accent words in <span className="gradient-text-vivid">. */
  title: ReactNode;
  /** Optional supporting line under the heading. */
  subtitle?: ReactNode;
  /** Optional icon rendered inside the eyebrow pill (before the animated dot is skipped). */
  icon?: ReactNode;
  align?: "left" | "center";
  tone?: "blue" | "purple";
  className?: string;
};

/**
 * Shared, decorated section heading: gradient eyebrow pill + animated dot, an
 * oversized theme-coloured title, and a gradient accent bar. Keeps every
 * section header on-brand and consistent.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  icon,
  align = "center",
  tone = "purple",
  className = "",
}: Props) {
  const center = align === "center";

  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <span
        className={`${tone === "blue" ? "section-label" : "section-label-purple"} ${
          center ? "" : ""
        }`}
      >
        {icon ?? (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
        )}
        {eyebrow}
      </span>

      <h2 className="mt-5 text-[2rem] font-extrabold leading-[1.1] tracking-tight text-[#1D1D1F] md:text-[2.5rem] lg:text-[2.85rem]">
        {title}
      </h2>

      <div className={`section-accent mt-5 ${center ? "mx-auto" : ""}`} />

      {subtitle && (
        <p
          className={`mt-4 text-base leading-relaxed text-[#6E6E73] ${
            center ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
