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

  // `tone` retained for API compatibility; the minimal system uses one accent.
  void tone;

  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      <span className="eyebrow">
        {icon}
        {eyebrow}
      </span>

      <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[#15151A] sm:text-3xl md:text-[2.25rem]">
        {title}
      </h2>

      {subtitle && (
        <p
          className={`mt-3 text-[15px] leading-relaxed text-[#5B5B66] ${
            center ? "mx-auto max-w-2xl" : "max-w-xl"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
