/**
 * 2026 university + course fee data, transcribed verbatim from
 * University-Course-Presentation-Guide.html (the authoritative fee sheet
 * normalized from official university fee structures).
 *
 * `brk` keeps the human-readable breakdown string exactly as in the guide;
 * the seed script parses it into structured installment rows using the same
 * rules the guide's own renderer used. Per-university component fees
 * (registration / processing / exam / other) come from each university's
 * fee note and are declared structurally in `fees`.
 */

export type RawCourse = {
  cat: string;
  name: string;
  /** Existing DB slug this course should update (preserves UUIDs/references) */
  dbSlug?: string;
  spec: string;
  dur: string;
  total: number | null;
  brk: string;
  /** Explicit starting-fee override (used by IGNOU/SGOU rows in the guide) */
  sf?: { a: number; t: string; unit: string };
};

export type OtherFeeSeed = {
  label: string;
  amount: number;
  recurrence: "one_time" | "per_year" | "per_semester";
  included: boolean;
};

export type UniFeeComponents = {
  /** one-time registration fee */
  registrationFee?: number;
  registrationIncluded?: boolean;
  /** one-time admission/processing fee */
  processingFee?: number;
  examFee?: number;
  examFeeRecurrence?: "per_year" | "per_semester";
  examFeeIncluded?: boolean;
  otherFees?: OtherFeeSeed[];
  emiAvailable?: boolean;
};

export type RawUniversity = {
  id: string;
  name: string;
  /** Existing DB slug this university should update (never re-slugged) */
  matchSlug?: string;
  /** Prefix used when generating slugs for NEW courses, matches DB convention */
  coursePrefix: string;
  short: string;
  city: string;
  state: string;
  mode: string;
  acc: string;
  note: string;
  feats: string[];
  color: string;
  color2: string;
  fees?: UniFeeComponents;
  courses: RawCourse[];
};

export type RawCategory = {
  key: string;
  icon: string;
  full: string;
  dur: string;
  lvl: string;
  elig: string;
};

export const CATS: RawCategory[] = [
  { key: "BBA",   icon: "💼",  full: "Bachelor of Business Administration", dur: "3 Years", lvl: "UG", elig: "10+2 (any stream) from a recognized board" },
  { key: "BCA",   icon: "💻",  full: "Bachelor of Computer Applications", dur: "3 Years", lvl: "UG", elig: "10+2 from a recognized board (Maths preferred at some universities)" },
  { key: "B.Com", icon: "🧾",  full: "Bachelor of Commerce", dur: "3 Years", lvl: "UG", elig: "10+2 (any stream) from a recognized board" },
  { key: "BA",    icon: "📖",  full: "Bachelor of Arts", dur: "3 Years", lvl: "UG", elig: "10+2 (any stream) from a recognized board" },
  { key: "B.Sc",  icon: "🔬",  full: "Bachelor of Science", dur: "3 Years", lvl: "UG", elig: "10+2 with Science (PCM) from a recognized board" },
  { key: "B.Lib", icon: "📚",  full: "Bachelor of Library & Information Science", dur: "1 Year", lvl: "UG", elig: "Graduation in any discipline from a recognized university" },
  { key: "MBA",   icon: "📊",  full: "Master of Business Administration", dur: "2 Years", lvl: "PG", elig: "Bachelor's degree in any discipline from a recognized university" },
  { key: "MCA",   icon: "🖥️", full: "Master of Computer Applications", dur: "2 Years", lvl: "PG", elig: "Bachelor's degree (Maths at 10+2 or graduation level may be required)" },
  { key: "M.Com", icon: "💰",  full: "Master of Commerce", dur: "2 Years", lvl: "PG", elig: "B.Com or equivalent bachelor's degree" },
  { key: "MA",    icon: "🎓",  full: "Master of Arts", dur: "2 Years", lvl: "PG", elig: "Bachelor's degree in any discipline from a recognized university" },
  { key: "M.Sc",  icon: "🧮",  full: "Master of Science", dur: "2 Years", lvl: "PG", elig: "B.Sc or bachelor's degree with the relevant subject" },
  { key: "M.Lib", icon: "🗂️", full: "Master of Library & Information Science", dur: "1 Year", lvl: "PG", elig: "B.Lib.I.Sc from a recognized university" },
  { key: "MSW",   icon: "🤝",  full: "Master of Social Work", dur: "2 Years", lvl: "PG", elig: "Bachelor's degree in any discipline from a recognized university" },
  { key: "PGDCA", icon: "⌨️", full: "PG Diploma in Computer Applications", dur: "1 Year", lvl: "PG Diploma", elig: "Bachelor's degree in any discipline from a recognized university" },
];

export const DATA: RawUniversity[] = [
  {
    id: "sgvu", matchSlug: "suresh-gyan-vihar-university", coursePrefix: "sgvu", name: "Suresh Gyan Vihar University", short: "SGVU", city: "Jaipur", state: "Rajasthan", mode: "ODL",
    color: "#7c3aed", color2: "#a78bfa", acc: "NAAC Accredited",
    note: "Yearly fee = Program Fee + Exam Fee (₹3,000/yr). Fees can also be paid semester-wise.",
    feats: ["NAAC accredited university, Jaipur", "Distance (ODL) programs with flexible learning", "Semester-wise payment option available", "Exam fee included in the yearly fee", "Wide subject choice in BA (Triple Main)"],
    fees: { examFee: 3000, examFeeRecurrence: "per_year", examFeeIncluded: true },
    courses: [
      { cat: "BA",   name: "BA General (Triple Main)", dbSlug: "sgvu-ba-triple-main", spec: "Economics, History, English Literature, Political Science, Geography, Public Administration, Hindi, Sociology", dur: "3 Years", total: 48000, brk: "₹16,000 / year (Sem: ₹8,000)" },
      { cat: "BA",   name: "BA – Journalism & Mass Communication", dbSlug: "sgvu-ba-jmc", spec: "JMC", dur: "3 Years", total: 69000, brk: "₹23,000 / year (Sem: ₹11,500)" },
      { cat: "B.Com", name: "B.Com", dbSlug: "sgvu-bcom", spec: "General", dur: "3 Years", total: 54000, brk: "₹18,000 / year (Sem: ₹9,000)" },
      { cat: "BBA",  name: "BBA", dbSlug: "sgvu-bba", spec: "General", dur: "3 Years", total: 75000, brk: "₹25,000 / year (Sem: ₹12,500)" },
      { cat: "B.Lib", name: "B.Lib.I.Sc (BLIS)", dbSlug: "sgvu-blis", spec: "Library & Information Science", dur: "1 Year", total: 25000, brk: "₹25,000 (Sem: ₹12,500 × 2)" },
      { cat: "BCA",  name: "BCA", dbSlug: "sgvu-bca", spec: "General", dur: "3 Years", total: 75000, brk: "₹25,000 / year (Sem: ₹12,500)" },
      { cat: "B.Sc", name: "B.Sc (PCM)", dbSlug: "sgvu-bsc-pcm", spec: "Physics, Chemistry, Maths", dur: "3 Years", total: 69000, brk: "₹23,000 / year (Sem: ₹11,500)" },
      { cat: "M.Com", name: "M.Com", dbSlug: "sgvu-mcom", spec: "General", dur: "2 Years", total: 36000, brk: "₹18,000 / year (Sem: ₹9,000)" },
      { cat: "MA",   name: "MA Economics", dbSlug: "sgvu-ma-economics", spec: "Economics", dur: "2 Years", total: 32000, brk: "₹16,000 / year (Sem: ₹8,000)" },
      { cat: "M.Sc", name: "M.Sc Mathematics", dbSlug: "sgvu-msc-maths", spec: "Mathematics", dur: "2 Years", total: 50000, brk: "₹25,000 / year (Sem: ₹12,500)" },
      { cat: "MBA",  name: "MBA General", dbSlug: "sgvu-mba-general", spec: "Major: HRM, Marketing, Finance, Operations & Production, Strategic Mgmt, Entrepreneurship, IT, Business Analytics, Banking, E-Commerce, Media & Entertainment · Minor: Supply Chain, Intl. Marketing, Branding, Digital Marketing, Investment Banking & more", dur: "2 Years", total: 70000, brk: "₹35,000 / year (Sem: ₹17,500)" },
      { cat: "MBA",  name: "MBA (PRO)", dbSlug: "sgvu-mba-pro", spec: "Dual specialisation options", dur: "2 Years", total: 70000, brk: "₹35,000 / year (Sem: ₹17,500)" },
      { cat: "MCA",  name: "MCA", dbSlug: "sgvu-mca", spec: "General", dur: "2 Years", total: 70000, brk: "₹35,000 / year (Sem: ₹17,500)" },
    ],
  },
  {
    id: "svsu", matchSlug: "subharti-university", coursePrefix: "svsu", name: "Swami Vivekanand Subharti University", short: "SVSU", city: "Meerut", state: "Uttar Pradesh", mode: "ODL",
    color: "#0ea5e9", color2: "#7dd3fc", acc: "NAAC Accredited",
    note: "1st-year fee includes one-time Registration ₹1,500 + Admission Processing ₹1,500. Exam fee ₹2,000/yr included in year fee.",
    feats: ["NAAC accredited university, Meerut", "Budget-friendly ODL fee structure", "Exam fee included in the yearly fee", "One-time registration & processing in 1st year only", "Wide MA subject range including Buddhist Studies"],
    fees: { registrationFee: 1500, registrationIncluded: true, processingFee: 1500, examFee: 2000, examFeeRecurrence: "per_year", examFeeIncluded: true },
    courses: [
      { cat: "BA",   name: "BA General (Triple Main)", dbSlug: "svsu-ba-hindi-english-political-science-history-economics-sociology-maths", spec: "Hindi, English, History, Political Science, Economics, Sociology, Mathematics", dur: "3 Years", total: 37500, brk: "1st Yr ₹13,500 · 2nd Yr ₹12,000 · 3rd Yr ₹12,000" },
      { cat: "BA",   name: "BA (JMC)", dbSlug: "svsu-bachelor-of-arts-jmc", spec: "Journalism & Mass Communication", dur: "3 Years", total: 52500, brk: "1st Yr ₹18,500 · 2nd Yr ₹17,000 · 3rd Yr ₹17,000" },
      { cat: "B.Lib", name: "B.Lib.I.Sc", dbSlug: "svsu-bachelor-of-library-and-information-sciences", spec: "Library & Information Sciences", dur: "1 Year", total: 23500, brk: "₹23,500 (single year)" },
      { cat: "BBA",  name: "BBA", dbSlug: "svsu-bachelor-of-business-administration", spec: "General", dur: "3 Years", total: 67500, brk: "1st Yr ₹23,500 · 2nd Yr ₹22,000 · 3rd Yr ₹22,000" },
      { cat: "B.Com", name: "B.Com", dbSlug: "svsu-bachelor-of-commerce", spec: "General", dur: "3 Years", total: 37500, brk: "1st Yr ₹13,500 · 2nd Yr ₹12,000 · 3rd Yr ₹12,000" },
      { cat: "B.Com", name: "B.Com (Honours)", dbSlug: "svsu-bachelor-of-commerce-honours", spec: "Honours", dur: "3 Years", total: 52500, brk: "1st Yr ₹18,500 · 2nd Yr ₹17,000 · 3rd Yr ₹17,000" },
      { cat: "MA",   name: "MA", dbSlug: "svsu-ma-public-administration-home-science-political-science-maths-sociology-history-hindi-economics-english", spec: "Public Administration, Home Science, Political Science, Maths, Sociology, History, Hindi, Economics, English", dur: "2 Years", total: 34500, brk: "1st Yr ₹18,000 · 2nd Yr ₹16,500" },
      { cat: "MA",   name: "MA – Buddhist Studies", dbSlug: "svsu-master-of-arts-buddhist-studies", spec: "Buddhist Studies", dur: "2 Years", total: 35500, brk: "1st Yr ₹18,500 · 2nd Yr ₹17,000" },
      { cat: "MA",   name: "MA – Education", dbSlug: "svsu-master-of-arts-education", spec: "Education", dur: "2 Years", total: 45500, brk: "1st Yr ₹23,500 · 2nd Yr ₹22,000" },
      { cat: "MA",   name: "MA (JMC)", dbSlug: "svsu-master-of-arts-jmc", spec: "Journalism & Mass Communication", dur: "2 Years", total: 45500, brk: "1st Yr ₹23,500 · 2nd Yr ₹22,000" },
      { cat: "M.Lib", name: "M.Lib.I.Sc", dbSlug: "svsu-master-of-library-and-information-sciences", spec: "Library & Information Sciences", dur: "1 Year", total: 23500, brk: "₹23,500 (single year)" },
      { cat: "MBA",  name: "MBA", dbSlug: "svsu-mba-it-hrm-marketing-management-fm-fashion-designing-operation-management-supply-chain-management-project-management", spec: "IT, HRM, Marketing Mgmt, Financial Mgmt, Fashion Designing, Operation Mgmt, Supply Chain Mgmt, Project Mgmt", dur: "2 Years", total: 65500, brk: "1st Yr ₹33,500 · 2nd Yr ₹32,000" },
      { cat: "M.Com", name: "M.Com", dbSlug: "svsu-mcom", spec: "General", dur: "2 Years", total: 37500, brk: "1st Yr ₹19,500 · 2nd Yr ₹18,000" },
    ],
  },
  {
    id: "amu", coursePrefix: "amu", name: "Aligarh Muslim University", short: "AMU", city: "Aligarh", state: "Uttar Pradesh", mode: "Distance",
    color: "#166534", color2: "#4ade80", acc: "Central University",
    note: "Fee structure shared on request — contact the admission counsellor.",
    feats: ["Prestigious Central University", "Historic institution with national reputation", "Distance education mode", "Classic BA / MA subject combinations"],
    courses: [
      { cat: "BA",   name: "BA", spec: "English, Economics, Hindi, History, Political Science, Urdu", dur: "3 Years", total: null, brk: "Fee on request" },
      { cat: "B.Com", name: "B.Com", spec: "General", dur: "3 Years", total: null, brk: "Fee on request" },
      { cat: "MA",   name: "MA", spec: "English, Economics, Hindi, History, Political Science, Urdu", dur: "2 Years", total: null, brk: "Fee on request" },
      { cat: "M.Com", name: "M.Com", spec: "General", dur: "2 Years", total: null, brk: "Fee on request" },
    ],
  },
  {
    id: "mzu", matchSlug: "mizoram-university", coursePrefix: "mzu", name: "Mizoram University", short: "MZU", city: "Aizawl", state: "Mizoram", mode: "Online",
    color: "#0d9488", color2: "#5eead4", acc: "Central University",
    note: "1st-year fee includes one-time Registration ₹210 + Processing ₹4,000. Exam fee included in year fee.",
    feats: ["Central University — fully online mode", "Exam fee included in the yearly fee", "Very low one-time registration (₹210)", "MBA with modern specialisations incl. Big Data"],
    fees: { registrationFee: 210, registrationIncluded: true, processingFee: 4000 },
    courses: [
      { cat: "BA",   name: "BA Education", spec: "Education", dur: "3 Years", total: 50230, brk: "1st Yr ₹19,550 · 2nd Yr ₹15,340 · 3rd Yr ₹15,340" },
      { cat: "B.Com", name: "B.Com", spec: "General", dur: "3 Years", total: 50230, brk: "1st Yr ₹19,550 · 2nd Yr ₹15,340 · 3rd Yr ₹15,340" },
      { cat: "BBA",  name: "BBA", spec: "General", dur: "3 Years", total: 59860, brk: "1st Yr ₹22,760 · 2nd Yr ₹18,550 · 3rd Yr ₹18,550" },
      { cat: "BBA",  name: "BBA (E-Business)", dbSlug: "mzu-bba-e-business", spec: "E-Business", dur: "3 Years", total: 59860, brk: "1st Yr ₹22,760 · 2nd Yr ₹18,550 · 3rd Yr ₹18,550" },
      { cat: "MA",   name: "MA", spec: "Education, Economics, Sociology, Political Science", dur: "2 Years", total: 41690, brk: "1st Yr ₹22,950 · 2nd Yr ₹18,740" },
      { cat: "MBA",  name: "MBA", dbSlug: "mzu-mba-financial-management", spec: "HRM, Financial Management, Entrepreneurship, Marketing Management", dur: "2 Years", total: 58050, brk: "1st Yr ₹31,130 · 2nd Yr ₹26,920" },
      { cat: "MBA",  name: "MBA (Advanced Specialisations)", dbSlug: "mzu-mba-logistics-supply-chain-management", spec: "Logistics & Supply Chain Management, Big Data Analytics", dur: "2 Years", total: 60690, brk: "1st Yr ₹32,450 · 2nd Yr ₹28,240" },
    ],
  },
  {
    id: "muj", matchSlug: "manipal-university-jaipur", coursePrefix: "manipal-jaipur", name: "Manipal University Jaipur", short: "MUJ", city: "Jaipur", state: "Rajasthan", mode: "Online",
    color: "#ea580c", color2: "#fdba74", acc: "NAAC A+",
    note: "Application fee ₹500 extra. Easy EMI options & international fee plans available.",
    feats: ["NAAC A+ accredited — premium online programs", "Easy no-cost EMI payment options", "International fee plans available", "Rich specialisation menu (AI, Analytics, FinTech)", "Part of the reputed Manipal education group"],
    fees: { emiAvailable: true, otherFees: [{ label: "Application Fee", amount: 500, recurrence: "one_time", included: false }] },
    courses: [
      { cat: "BBA",  name: "BBA", dbSlug: "manipal-jaipur-bba", spec: "HRM, Marketing, Finance & Accounting, Entrepreneurship & Family Business, Data Analytics, Retail & E-Commerce, Digital Marketing", dur: "3 Years", total: 139500, brk: "₹46,500 / year (Sem: ₹23,250)" },
      { cat: "B.Com", name: "B.Com", dbSlug: "manipal-jaipur-b-com", spec: "Digital Marketing with AI, E-Commerce, Banking & FinTech, Business Analytics, Financial Analytics, Business Accounting & Taxation, Accounting with AI, Economics", dur: "3 Years", total: 99000, brk: "₹33,000 / year (Sem: ₹16,500)" },
      { cat: "BCA",  name: "BCA", dbSlug: "manipal-jaipur-bca", spec: "Data Science & Analytics, Cloud Computing, Cyber Security", dur: "3 Years", total: 139500, brk: "₹46,500 / year (Sem: ₹23,250)" },
      { cat: "MBA",  name: "MBA", dbSlug: "manipal-jaipur-mba-includes-5000-exam-fee", spec: "Information System Mgmt, Finance, HRM, BFSI, Digital Marketing, Marketing, Analytics & Data Science, IT & FinTech, Operations, International Business, Project Mgmt, Supply Chain, Retail Mgmt", dur: "2 Years", total: 180000, brk: "₹90,000 / year (Sem: ₹45,000)" },
      { cat: "MCA",  name: "MCA", dbSlug: "manipal-jaipur-mca-includes-5000-exam-fee", spec: "AI & ML, AI & Data Science, Cloud Computing, Cyber Security, Comprehensive Emerging Technology", dur: "2 Years", total: 158000, brk: "₹79,000 / year (Sem: ₹39,500)" },
      { cat: "MA",   name: "MA – JMC", dbSlug: "manipal-jaipur-ma-jmc", spec: "Journalism & Mass Communication", dur: "2 Years", total: 80000, brk: "₹40,000 / year (Sem: ₹20,000)" },
      { cat: "MA",   name: "MA – Economics", dbSlug: "manipal-jaipur-ma-economics", spec: "Economics", dur: "2 Years", total: 80000, brk: "₹40,000 / year (Sem: ₹20,000)" },
      { cat: "M.Com", name: "M.Com", dbSlug: "manipal-jaipur-m-com", spec: "General", dur: "2 Years", total: 108000, brk: "₹54,000 / year (Sem: ₹27,000)" },
      { cat: "M.Sc", name: "M.Sc Mathematics", dbSlug: "manipal-jaipur-msc-mathematics", spec: "Mathematics", dur: "2 Years", total: 80000, brk: "₹40,000 / year (Sem: ₹20,000)" },
    ],
  },
  {
    id: "smu", matchSlug: "sikkim-manipal-university", coursePrefix: "smu", name: "Sikkim Manipal University", short: "SMU", city: "Gangtok", state: "Sikkim", mode: "Online",
    color: "#d97706", color2: "#fcd34d", acc: "NAAC Accredited",
    note: "Application fee ₹500 extra. Fees payable semester-wise. International fee plans available.",
    feats: ["Trusted Manipal group university", "Fees payable comfortably semester-wise", "International fee plans available", "Established name in online & distance education"],
    fees: { otherFees: [{ label: "Application Fee", amount: 500, recurrence: "one_time", included: false }] },
    courses: [
      { cat: "BA",   name: "BA", dbSlug: "smu-ba-english-sociology-political-science", spec: "English, Sociology, Political Science", dur: "3 Years", total: 75000, brk: "₹12,500 / semester × 6" },
      { cat: "B.Com", name: "B.Com", dbSlug: "smu-bcom", spec: "General", dur: "3 Years", total: 75000, brk: "₹12,500 / semester × 6" },
      { cat: "BBA",  name: "BBA", dbSlug: "smu-bba", spec: "Business Analytics, Entrepreneurship, Operations & Banking", dur: "3 Years", total: 90000, brk: "₹15,000 / semester × 6" },
      { cat: "MA",   name: "MA", dbSlug: "smu-ma-english-sociology-political-science", spec: "English, Sociology, Political Science", dur: "2 Years", total: 75000, brk: "₹18,750 / semester × 4" },
      { cat: "M.Com", name: "M.Com", dbSlug: "smu-mcom", spec: "General", dur: "2 Years", total: 75000, brk: "₹18,750 / semester × 4" },
      { cat: "MCA",  name: "MCA", dbSlug: "smu-mca", spec: "General", dur: "2 Years", total: 110000, brk: "₹27,500 / semester × 4" },
      { cat: "MBA",  name: "MBA", dbSlug: "smu-mba-marketing-finance-hr-systems-operations-supply-chain-management-health-care", spec: "Marketing, Finance, HR, Systems, Operations & Supply Chain Mgmt, Healthcare", dur: "2 Years", total: 120000, brk: "₹30,000 / semester × 4" },
    ],
  },
  {
    id: "jain", matchSlug: "jain-university", coursePrefix: "jain", name: "Jain University (ODL)", short: "JAIN", city: "Bengaluru", state: "Karnataka", mode: "ODL · WLP",
    color: "#e11d48", color2: "#fda4af", acc: "NAAC A++",
    note: "Work-Linked Program (WLP). Year fee includes Registration ₹500 (one-time), Exam Fee, Admission Processing ₹4,000 & Apprenticeship Fee ₹5,000.",
    feats: ["NAAC A++ accredited deemed university", "Work-Linked Programs (WLP) with apprenticeship", "Earn practical experience while you study", "All processing & apprenticeship fees included"],
    fees: { registrationFee: 500, registrationIncluded: true, processingFee: 4000, otherFees: [{ label: "Apprenticeship Fee", amount: 5000, recurrence: "one_time", included: true }] },
    courses: [
      { cat: "BBA",  name: "BBA (WLP)", dbSlug: "jain-bba-wlp", spec: "Work-Linked Program", dur: "3 Years", total: 77000, brk: "1st Yr ₹26,000 · 2nd Yr ₹25,500 · 3rd Yr ₹25,500" },
      { cat: "B.Com", name: "B.Com (WLP)", dbSlug: "jain-bcom-wlp", spec: "Work-Linked Program", dur: "3 Years", total: 66500, brk: "1st Yr ₹22,500 · 2nd Yr ₹22,000 · 3rd Yr ₹22,000" },
      { cat: "BCA",  name: "BCA (WLP)", dbSlug: "jain-bca-wlp", spec: "Work-Linked Program", dur: "3 Years", total: 78500, brk: "1st Yr ₹26,500 · 2nd Yr ₹26,000 · 3rd Yr ₹26,000" },
      { cat: "MBA",  name: "MBA (WLP)", dbSlug: "jain-mba-wlp", spec: "Marketing, Finance, Logistics & Supply Chain, HRM", dur: "2 Years", total: 104500, brk: "1st Yr ₹52,500 · 2nd Yr ₹52,000" },
      { cat: "MCA",  name: "MCA (WLP)", dbSlug: "jain-mca-wlp", spec: "Work-Linked Program", dur: "2 Years", total: 74500, brk: "1st Yr ₹37,500 · 2nd Yr ₹37,000" },
      { cat: "MSW",  name: "MSW (WLP)", dbSlug: "jain-master-of-social-work", spec: "Master of Social Work", dur: "2 Years", total: 43500, brk: "1st Yr ₹22,000 · 2nd Yr ₹21,500" },
      { cat: "M.Com", name: "M.Com (WLP)", dbSlug: "jain-mcom-wlp", spec: "Work-Linked Program", dur: "2 Years", total: 43500, brk: "1st Yr ₹22,000 · 2nd Yr ₹21,500" },
      { cat: "MA",   name: "MA Economics (WLP)", spec: "Economics", dur: "2 Years", total: null, brk: "Fee on request" },
    ],
  },
  {
    id: "andhra", matchSlug: "andhra-university", coursePrefix: "andhra", name: "Andhra University", short: "AU", city: "Visakhapatnam", state: "Andhra Pradesh", mode: "Distance",
    color: "#4f46e5", color2: "#a5b4fc", acc: "NAAC A+",
    note: "1st-year fee includes one-time Registration ₹1,000 + Processing ₹4,000. Exam fee ₹2,000/yr included.",
    feats: ["Historic state university (est. 1926)", "NAAC A+ accredited", "Very affordable distance programs", "Exam fee included in the yearly fee"],
    fees: { registrationFee: 1000, registrationIncluded: true, processingFee: 4000, examFee: 2000, examFeeRecurrence: "per_year", examFeeIncluded: true },
    courses: [
      { cat: "BA",   name: "BA", dbSlug: "andhra-ba-history-economics-politics", spec: "History, Economics, Political Science", dur: "3 Years", total: 34750, brk: "1st Yr ₹12,250 · 2nd Yr ₹11,250 · 3rd Yr ₹11,250" },
      { cat: "B.Com", name: "B.Com", dbSlug: "andhra-b-com", spec: "General", dur: "3 Years", total: 34750, brk: "1st Yr ₹12,250 · 2nd Yr ₹11,250 · 3rd Yr ₹11,250" },
      { cat: "M.Com", name: "M.Com", dbSlug: "andhra-m-com", spec: "General", dur: "2 Years", total: 27700, brk: "1st Yr ₹14,350 · 2nd Yr ₹13,350" },
      { cat: "MA",   name: "MA", dbSlug: "andhra-ma-political-science-english-economics", spec: "Political Science, English, Economics", dur: "2 Years", total: 27700, brk: "1st Yr ₹14,350 · 2nd Yr ₹13,350" },
      { cat: "MA",   name: "MA – HRM", dbSlug: "andhra-ma-human-resource-management", spec: "Human Resource Management", dur: "2 Years", total: 36100, brk: "1st Yr ₹18,550 · 2nd Yr ₹17,550" },
      { cat: "MA",   name: "MA – JMC", dbSlug: "andhra-ma-journalism-mass-communication", spec: "Journalism & Mass Communication", dur: "2 Years", total: 29800, brk: "1st Yr ₹15,400 · 2nd Yr ₹14,400" },
    ],
  },
  {
    id: "mangala", matchSlug: "mangalayatan-university", coursePrefix: "mangalayatan", name: "Mangalayatan University", short: "MU", city: "Aligarh", state: "Uttar Pradesh", mode: "Online / Distance",
    color: "#db2777", color2: "#f9a8d4", acc: "UGC Recognized",
    note: "1st-year fee includes one-time Registration ₹1,000. Exam fee ₹3,000/yr included in year fee.",
    feats: ["UGC recognized university", "Both Online & Distance modes available", "Exam fee included in the yearly fee", "Affordable fee across UG & PG programs"],
    fees: { registrationFee: 1000, registrationIncluded: true, examFee: 3000, examFeeRecurrence: "per_year", examFeeIncluded: true },
    courses: [
      { cat: "BA",   name: "BA", dbSlug: "mangalayatan-ba", spec: "General", dur: "3 Years", total: 40000, brk: "1st Yr ₹14,000 · 2nd Yr ₹13,000 · 3rd Yr ₹13,000" },
      { cat: "BBA",  name: "BBA", dbSlug: "mangalayatan-bba", spec: "General", dur: "3 Years", total: 64000, brk: "1st Yr ₹22,000 · 2nd Yr ₹21,000 · 3rd Yr ₹21,000" },
      { cat: "BCA",  name: "BCA", dbSlug: "mangalayatan-bca", spec: "General", dur: "3 Years", total: 70000, brk: "1st Yr ₹24,000 · 2nd Yr ₹23,000 · 3rd Yr ₹23,000" },
      { cat: "MA",   name: "MA", dbSlug: "mangalayatan-ma-english", spec: "English, Political Science, JMC, Education, Public Administration", dur: "2 Years", total: 35000, brk: "1st Yr ₹18,000 · 2nd Yr ₹17,000" },
      { cat: "MBA",  name: "MBA", dbSlug: "mangalayatan-mba-marketing-hr-finance-operation-management", spec: "Marketing, HR, Finance, Operations Management", dur: "2 Years", total: 67000, brk: "1st Yr ₹34,000 · 2nd Yr ₹33,000" },
      { cat: "M.Com", name: "M.Com", dbSlug: "mangalayatan-mcom", spec: "General", dur: "2 Years", total: 35000, brk: "1st Yr ₹18,000 · 2nd Yr ₹17,000" },
      { cat: "MCA",  name: "MCA", dbSlug: "mangalayatan-mca", spec: "General", dur: "2 Years", total: 67000, brk: "1st Yr ₹34,000 · 2nd Yr ₹33,000" },
      { cat: "M.Sc", name: "M.Sc Maths", dbSlug: "mangalayatan-msc-maths", spec: "Mathematics", dur: "2 Years", total: 55000, brk: "1st Yr ₹28,000 · 2nd Yr ₹27,000" },
    ],
  },
  {
    id: "amrita", matchSlug: "amrita-university", coursePrefix: "amrita", name: "Amrita University (Online)", short: "AHEAD", city: "Coimbatore", state: "Tamil Nadu", mode: "Online",
    color: "#b91c1c", color2: "#fca5a5", acc: "NAAC A++",
    note: "Registration ₹700 (one-time). Exam fee ₹2,750 per semester ADDITIONAL to fees shown. International fee plans available.",
    feats: ["NAAC A++ accredited, top-ranked university", "Premium online programs (Amrita AHEAD)", "ACCA-integrated commerce & MBA options", "AI, Analytics, Cyber Security specialisations", "International fee plans available"],
    fees: { registrationFee: 700, registrationIncluded: false, examFee: 2750, examFeeRecurrence: "per_semester", examFeeIncluded: false },
    courses: [
      { cat: "BBA",  name: "BBA General", dbSlug: "amrita-bba-general", spec: "General", dur: "3 Years", total: 141000, brk: "₹23,500 / semester × 6" },
      { cat: "BBA",  name: "BBA Digital Marketing", dbSlug: "amrita-bba-digital-marketing", spec: "Digital Marketing", dur: "3 Years", total: 165000, brk: "₹27,500 / semester × 6" },
      { cat: "BBA",  name: "BBA ACCA", dbSlug: "amrita-bba-acca", spec: "ACCA Integrated", dur: "3 Years", total: 250000, brk: "₹41,667 / semester × 6" },
      { cat: "BCA",  name: "BCA General", dbSlug: "amrita-bca-general", spec: "General", dur: "3 Years", total: 141000, brk: "₹23,500 / semester × 6" },
      { cat: "BCA",  name: "BCA AI & Data Science", dbSlug: "amrita-bca-artificial-intelligence-data-science", spec: "Artificial Intelligence & Data Science", dur: "3 Years", total: 165000, brk: "₹27,500 / semester × 6" },
      { cat: "B.Com", name: "B.Com", dbSlug: "amrita-bcom", spec: "General (Taxation & Finance)", dur: "3 Years", total: 120000, brk: "₹20,000 / semester × 6" },
      { cat: "B.Com", name: "B.Com International", dbSlug: "amrita-bcom-intl", spec: "International Finance & Accounting (ACCA)", dur: "3 Years", total: 243000, brk: "₹40,500 / semester × 6" },
      { cat: "MBA",  name: "MBA", dbSlug: "amrita-mba-fin-mktg-hr-fintech", spec: "Finance, Marketing, HR, FinTech", dur: "2 Years", total: 220000, brk: "₹55,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – Operations", dbSlug: "amrita-mba-operations", spec: "Operations", dur: "2 Years", total: 224000, brk: "₹56,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – Business Analytics", dbSlug: "amrita-mba-business-analytics", spec: "Business Analytics", dur: "2 Years", total: 224000, brk: "₹56,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – General Management", dbSlug: "amrita-mba-gen-mgmt", spec: "General Management", dur: "2 Years", total: 176000, brk: "₹44,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – International", dbSlug: "amrita-mba-intl", spec: "International Finance & Marketing (ACCA)", dur: "2 Years", total: 260000, brk: "₹65,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – AI", dbSlug: "amrita-mba-ai", spec: "Artificial Intelligence", dur: "2 Years", total: 244000, brk: "₹61,000 / semester × 4" },
      { cat: "MBA",  name: "MBA – ESG", dbSlug: "amrita-mba-esg", spec: "Environmental, Social & Governance", dur: "2 Years", total: 196000, brk: "₹49,000 / semester × 4" },
      { cat: "MCA",  name: "MCA", dbSlug: "amrita-mca", spec: "General", dur: "2 Years", total: 140000, brk: "₹35,000 / semester × 4" },
      { cat: "MCA",  name: "MCA – AI", dbSlug: "amrita-mca-ai-1st-sem", spec: "Artificial Intelligence", dur: "2 Years", total: 195000, brk: "Sem 1: ₹45,000 · Sem 2–4: ₹50,000 each" },
      { cat: "MCA",  name: "MCA – Cyber Security", dbSlug: "amrita-mca-cyber-1st-sem", spec: "Cyber Security", dur: "2 Years", total: 195000, brk: "Sem 1: ₹45,000 · Sem 2–4: ₹50,000 each" },
      { cat: "M.Com", name: "M.Com", dbSlug: "amrita-mcom", spec: "General", dur: "2 Years", total: 90000, brk: "₹22,500 / semester × 4" },
      { cat: "M.Com", name: "M.Com International", dbSlug: "amrita-mcom-intl", spec: "International Finance", dur: "2 Years", total: 120000, brk: "₹30,000 / semester × 4" },
    ],
  },
  {
    id: "shobhit", coursePrefix: "shobhit", name: "Shobhit University", short: "SU", city: "Meerut", state: "Uttar Pradesh", mode: "Online / Distance",
    color: "#059669", color2: "#6ee7b7", acc: "UGC Recognized",
    note: "Fee structure shared on request — contact the admission counsellor.",
    feats: ["UGC recognized university, Meerut", "Online & Distance modes available", "Modern specialisations (AI/ML, Cyber Security)", "Personalised fee quote via counsellor"],
    courses: [
      { cat: "BBA",  name: "BBA", spec: "Finance, Marketing, HR Management", dur: "3 Years", total: null, brk: "Fee on request" },
      { cat: "BCA",  name: "BCA", spec: "AI & Machine Learning, Cyber Security", dur: "3 Years", total: null, brk: "Fee on request" },
      { cat: "MBA",  name: "MBA", spec: "Finance, Marketing, HRM, Agri-Business, Pharmaceutical Mgmt, Logistics & Supply Chain", dur: "2 Years", total: null, brk: "Fee on request" },
      { cat: "MCA",  name: "MCA", spec: "Cloud Computing, AI & ML, Full Stack Development, Cyber Security, Data Science", dur: "2 Years", total: null, brk: "Fee on request" },
      { cat: "PGDCA", name: "PGDCA", spec: "Computer Applications", dur: "1 Year", total: null, brk: "Fee on request" },
    ],
  },
  {
    id: "gla", matchSlug: "gla-university", coursePrefix: "gla", name: "GLA University (CDOE)", short: "GLA", city: "Mathura", state: "Uttar Pradesh", mode: "Online / ODL",
    color: "#16a34a", color2: "#86efac", acc: "NAAC A+",
    note: "Total includes Registration ₹500 + Alumni Fee ₹1,800 (one-time) + Exam Fee ₹1,500/sem. Discounts: ₹1,000–₹2,000/yr on yearly payment, ₹3,000–₹4,000 on one-time full payment.",
    feats: ["NAAC A+ accredited university, Mathura", "Discounts on yearly & one-time full payment", "Semester-wise payment supported", "Centre for Distance & Online Education (CDOE)"],
    fees: { registrationFee: 500, registrationIncluded: true, examFee: 1500, examFeeRecurrence: "per_semester", examFeeIncluded: true, otherFees: [{ label: "Alumni Fee", amount: 1800, recurrence: "one_time", included: true }] },
    courses: [
      { cat: "BBA",  name: "BBA", dbSlug: "gla-bba", spec: "Marketing Mgmt, HRM, Financial Mgmt, Banking & Insurance", dur: "3 Years", total: 99800, brk: "Registration ₹500 (one-time) · Sem 1: ₹18,050 · Sem 2–6: ₹16,250 each" },
      { cat: "B.Com", name: "B.Com", dbSlug: "gla-b-com", spec: "General", dur: "3 Years", total: 71300, brk: "Registration ₹500 (one-time) · Sem 1: ₹13,300 · Sem 2–6: ₹11,500 each" },
      { cat: "BCA",  name: "BCA", dbSlug: "gla-bca", spec: "General", dur: "3 Years", total: 99800, brk: "Registration ₹500 (one-time) · Sem 1: ₹18,050 · Sem 2–6: ₹16,250 each" },
      { cat: "MBA",  name: "MBA", dbSlug: "gla-mba", spec: "Marketing Mgmt, HRM, Financial Mgmt, IT, Operations, Banking & Financial Services, Business Analytics, Supply Chain", dur: "2 Years", total: 105300, brk: "Registration ₹500 (one-time) · Sem 1: ₹27,550 · Sem 2–4: ₹25,750 each" },
      { cat: "MCA",  name: "MCA", dbSlug: "gla-mca", spec: "General", dur: "2 Years", total: 94300, brk: "Registration ₹500 (one-time) · Sem 1: ₹24,800 · Sem 2–4: ₹23,000 each" },
    ],
  },
  {
    id: "ignou", coursePrefix: "ignou", name: "Indira Gandhi National Open University", short: "IGNOU", city: "New Delhi", state: "Delhi", mode: "ODL",
    color: "#1e3a8a", color2: "#93c5fd", acc: "Central Open University",
    note: "Total fee includes University Fee + Recorded Classes with all assistance + Registration & Service Charge (₹500) + GST (₹990).",
    feats: ["India's national open university — degree recognized everywhere", "Recorded classes with all assistance included", "Complete admission & study support through our center", "Most affordable government university option"],
    courses: [
      { cat: "B.Com", name: "B.Com", spec: "General", dur: "3 Years", total: 11990, sf: { a: 5500, t: "₹5,500", unit: "university fee" }, brk: "University Fee ₹5,500 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA", spec: "Sociology, English, History", dur: "3 Years", total: 12490, sf: { a: 6000, t: "₹6,000", unit: "university fee" }, brk: "University Fee ₹6,000 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BCA",  name: "BCA", spec: "General", dur: "3 Years", total: 24490, sf: { a: 18000, t: "₹18,000", unit: "university fee" }, brk: "University Fee ₹18,000 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BBA",  name: "BBA", spec: "General", dur: "3 Years", total: 17490, sf: { a: 11000, t: "₹11,000", unit: "university fee" }, brk: "University Fee ₹11,000 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "M.Com", name: "M.Com", spec: "General", dur: "2 Years", total: 17190, sf: { a: 10700, t: "₹10,700", unit: "university fee" }, brk: "University Fee ₹10,700 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MBA",  name: "MBA", spec: "General", dur: "2 Years", total: 39890, sf: { a: 33400, t: "₹33,400", unit: "university fee" }, brk: "University Fee ₹33,400 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA", spec: "Sociology, History, English", dur: "2 Years", total: 15190, sf: { a: 8700, t: "₹8,700", unit: "university fee" }, brk: "University Fee ₹8,700 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
    ],
  },
  {
    id: "sgou", coursePrefix: "sgou", name: "Sreenarayanaguru Open University", short: "SGOU", city: "Kollam", state: "Kerala", mode: "ODL",
    color: "#65a30d", color2: "#d9f99d", acc: "State Open University",
    note: "Total fee includes University Fee + Recorded Classes with all assistance + Registration & Service Charge (₹500) + GST (₹990).",
    feats: ["Kerala's own state open university", "Recorded classes with all assistance included", "Complete admission & study support through our center", "Malayalam, English & Arabic subject options"],
    courses: [
      { cat: "B.Com", name: "B.Com", spec: "General", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BBA",  name: "BBA", spec: "General", dur: "3 Years", total: 15480, sf: { a: 8990, t: "₹8,990", unit: "university fee" }, brk: "University Fee ₹8,990 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA Sociology", spec: "Sociology", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA Malayalam", spec: "Malayalam", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA Psychology", spec: "Psychology", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA English", spec: "English", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BA",   name: "BA Arabic", spec: "Arabic", dur: "3 Years", total: 13880, sf: { a: 7390, t: "₹7,390", unit: "university fee" }, brk: "University Fee ₹7,390 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "BCA",  name: "BCA", spec: "General", dur: "3 Years", total: 17480, sf: { a: 10990, t: "₹10,990", unit: "university fee" }, brk: "University Fee ₹10,990 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "M.Com", name: "M.Com", spec: "General", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA Sociology", spec: "Sociology", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA History", spec: "History", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA Malayalam", spec: "Malayalam", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA English", spec: "English", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
      { cat: "MA",   name: "MA Arabic", spec: "Arabic", dur: "2 Years", total: 15260, sf: { a: 8770, t: "₹8,770", unit: "university fee" }, brk: "University Fee ₹8,770 · Recorded Classes ₹5,000 · Registration & Service ₹500 · GST ₹990" },
    ],
  },
];
