/**
 * Degree-level browsing metadata. The DB's course_categories hold broad
 * disciplines; degree keys (MBA, BCA, …) live on courses.shortName. This map
 * provides the display metadata for degree cards and comparison pages.
 */
export type DegreeMeta = {
  key: string; // matches courses.shortName
  slug: string; // URL segment under /courses/
  icon: string;
  full: string;
  duration: string;
  level: string;
  eligibility: string;
};

export const DEGREES: DegreeMeta[] = [
  { key: "MBA",   slug: "mba",   icon: "📊",  full: "Master of Business Administration", duration: "2 Years", level: "PG", eligibility: "Bachelor's degree in any discipline from a recognized university" },
  { key: "MCA",   slug: "mca",   icon: "🖥️", full: "Master of Computer Applications", duration: "2 Years", level: "PG", eligibility: "Bachelor's degree (Maths at 10+2 or graduation level may be required)" },
  { key: "BBA",   slug: "bba",   icon: "💼",  full: "Bachelor of Business Administration", duration: "3 Years", level: "UG", eligibility: "10+2 (any stream) from a recognized board" },
  { key: "BCA",   slug: "bca",   icon: "💻",  full: "Bachelor of Computer Applications", duration: "3 Years", level: "UG", eligibility: "10+2 from a recognized board (Maths preferred at some universities)" },
  { key: "B.Com", slug: "bcom",  icon: "🧾",  full: "Bachelor of Commerce", duration: "3 Years", level: "UG", eligibility: "10+2 (any stream) from a recognized board" },
  { key: "M.Com", slug: "mcom",  icon: "💰",  full: "Master of Commerce", duration: "2 Years", level: "PG", eligibility: "B.Com or equivalent bachelor's degree" },
  { key: "BA",    slug: "ba",    icon: "📖",  full: "Bachelor of Arts", duration: "3 Years", level: "UG", eligibility: "10+2 (any stream) from a recognized board" },
  { key: "MA",    slug: "ma",    icon: "🎓",  full: "Master of Arts", duration: "2 Years", level: "PG", eligibility: "Bachelor's degree in any discipline from a recognized university" },
  { key: "B.Sc",  slug: "bsc",   icon: "🔬",  full: "Bachelor of Science", duration: "3 Years", level: "UG", eligibility: "10+2 with Science (PCM) from a recognized board" },
  { key: "M.Sc",  slug: "msc",   icon: "🧮",  full: "Master of Science", duration: "2 Years", level: "PG", eligibility: "B.Sc or bachelor's degree with the relevant subject" },
  { key: "B.Lib", slug: "blib",  icon: "📚",  full: "Bachelor of Library & Information Science", duration: "1 Year", level: "UG", eligibility: "Graduation in any discipline from a recognized university" },
  { key: "M.Lib", slug: "mlib",  icon: "🗂️", full: "Master of Library & Information Science", duration: "1 Year", level: "PG", eligibility: "B.Lib.I.Sc from a recognized university" },
  { key: "MSW",   slug: "msw",   icon: "🤝",  full: "Master of Social Work", duration: "2 Years", level: "PG", eligibility: "Bachelor's degree in any discipline from a recognized university" },
  { key: "PGDCA", slug: "pgdca", icon: "⌨️", full: "PG Diploma in Computer Applications", duration: "1 Year", level: "PG Diploma", eligibility: "Bachelor's degree in any discipline from a recognized university" },
];

export const degreeBySlug = (slug: string) =>
  DEGREES.find((d) => d.slug === slug);
export const degreeByKey = (key: string | null | undefined) =>
  key ? DEGREES.find((d) => d.key.toLowerCase() === key.toLowerCase()) : undefined;
