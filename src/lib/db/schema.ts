import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// NOTE ON SCHEMA OWNERSHIP
// These public-content tables are shared with the admin dashboard
// (iode-tracker), which mirrors them in its src/lib/db/external.ts. Structural
// changes are applied with hand-written idempotent SQL (see
// scripts/apply-fee-schema.ts), NOT drizzle-kit migrations — the drizzle
// journal predates several live columns. If you change a table here, apply the
// SQL to staging + production and update the dashboard mirror by hand.
// ============================================================================

// ---- JSONB shapes ----------------------------------------------------------

/** universities.highlights */
export type UniversityHighlights = {
  naac?: string;
  established?: string;
  approvals?: string;
  students?: string;
  accreditation?: string;
  /** Delivery mode label shown on cards, e.g. "Online", "ODL", "Online / Distance" */
  mode?: string;
  /** Marketing feature bullets shown on the university page */
  features?: string[];
  /** University-wide fee note, e.g. "Exam fee included in the yearly fee" */
  feeNote?: string;
  /** Card/banner gradient colors (hex), set by the seed and editable in admin */
  brandColor?: string;
  brandColor2?: string;
  /** Public homepage "Admissions Open" badge (managed by admin) */
  admissionOpen?: boolean;
};

/** course_fee_structures.other_fees — arbitrary named fee components */
export type OtherFee = {
  label: string;
  amount: number;
  recurrence: "one_time" | "per_year" | "per_semester";
  /** true when the amount is already included in total_fee (informational) */
  included: boolean;
};

// ============================================
// Universities
// ============================================
export const universities = pgTable(
  "universities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).unique(),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 100 }),
    slug: varchar("slug", { length: 255 }).unique(),
    logoUrl: text("logo_url"),
    bannerImage: text("banner_image"),
    galleryImages: text("gallery_images").array(),
    highlights: jsonb("highlights").$type<UniversityHighlights>(),
    content: text("content"), // markdown brochure body
    website: text("website"),
    universityType: varchar("university_type", { length: 100 }),
    country: varchar("country", { length: 100 }).default("India"),
    state: varchar("state", { length: 100 }),
    city: varchar("city", { length: 100 }),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_universities_slug").on(table.slug),
  ]
);

export const universitiesRelations = relations(universities, ({ many }) => ({
  courses: many(courses),
}));

// ============================================
// Course Categories
// ============================================
export const courseCategories = pgTable("course_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: varchar("slug", { length: 100 }).unique(),
});

export const courseCategoriesRelations = relations(
  courseCategories,
  ({ many }) => ({
    courses: many(courses),
  })
);

// ============================================
// Courses
// ============================================
export const courses = pgTable(
  "courses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    universityId: uuid("university_id").references(() => universities.id, {
      onDelete: "cascade",
    }),
    categoryId: uuid("category_id").references(() => courseCategories.id),
    name: varchar("name", { length: 255 }).notNull(),
    shortName: varchar("short_name", { length: 100 }),
    slug: varchar("slug", { length: 255 }),
    courseType: varchar("course_type", { length: 100 }),
    deliveryMode: varchar("delivery_mode", { length: 100 }),
    durationYears: numeric("duration_years", { precision: 4, scale: 2 }),
    totalSemesters: integer("total_semesters"),
    eligibility: text("eligibility"),
    description: text("description"),
    content: text("content"), // markdown brochure body
    bannerImage: text("banner_image"),
    specializations: text("specializations").array(),
    isOnline: boolean("is_online").default(true),
    isDistance: boolean("is_distance").default(false),
    tags: text("tags").array(),
    // Note: search_vector (tsvector) is managed at the SQL level,
    // not mapped in Drizzle since it's auto-populated via triggers/updates
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_courses_university").on(table.universityId),
    index("idx_courses_category").on(table.categoryId),
    index("idx_courses_type").on(table.courseType),
    index("idx_courses_duration").on(table.durationYears),
  ]
);

export const coursesRelations = relations(courses, ({ one, many }) => ({
  university: one(universities, {
    fields: [courses.universityId],
    references: [universities.id],
  }),
  category: one(courseCategories, {
    fields: [courses.categoryId],
    references: [courseCategories.id],
  }),
  feeStructure: many(courseFeeStructures),
}));

// ============================================
// Course Fee Structures
// ============================================
export const courseFeeStructures = pgTable(
  "course_fee_structures",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id").references(() => courses.id, {
      onDelete: "cascade",
    }),
    registrationFee: numeric("registration_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    admissionFee: numeric("admission_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    courseFee: numeric("course_fee", { precision: 10, scale: 2 }).default("0"),
    examFee: numeric("exam_fee", { precision: 10, scale: 2 }).default("0"),
    certificateFee: numeric("certificate_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    processingFee: numeric("processing_fee", {
      precision: 10,
      scale: 2,
    }).default("0"),
    yearlyFee: numeric("yearly_fee", { precision: 10, scale: 2 }),
    totalFee: numeric("total_fee", { precision: 10, scale: 2 }),
    /** Discounted / offer total shown struck against totalFee */
    offerFee: numeric("offer_fee", { precision: 10, scale: 2 }),
    /** 'yearly' | 'semester' | 'one_time' — how installments are presented */
    paymentCycle: varchar("payment_cycle", { length: 20 }),
    /** Fee shared only via counsellor; hides all amounts on the site */
    feeOnRequest: boolean("fee_on_request").default(false),
    /** The "from ₹X" first payment shown on cards (admin can override) */
    startingFee: numeric("starting_fee", { precision: 10, scale: 2 }),
    /** e.g. 'per semester' | 'first year' | 'per year' | 'one-time' */
    startingFeeUnit: varchar("starting_fee_unit", { length: 30 }),
    /** Arbitrary named components: GST, alumni fee, recorded classes… */
    otherFees: jsonb("other_fees").$type<OtherFee[]>(),
    feeNote: text("fee_note"),
    currency: varchar("currency", { length: 10 }).default("INR"),
    emiAvailable: boolean("emi_available").default(false),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("idx_course_fee_total").on(table.totalFee),
    index("idx_course_fee_starting").on(table.startingFee),
  ]
);

export const courseFeeStructuresRelations = relations(
  courseFeeStructures,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseFeeStructures.courseId],
      references: [courses.id],
    }),
    breakdowns: many(courseFeeBreakdowns),
  })
);

// ============================================
// Course Fee Breakdowns (year/semester installments)
// ============================================
export const courseFeeBreakdowns = pgTable(
  "course_fee_breakdowns",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feeStructureId: uuid("fee_structure_id").references(
      () => courseFeeStructures.id,
      { onDelete: "cascade" }
    ),
    label: varchar("label", { length: 100 }),
    amount: numeric("amount", { precision: 10, scale: 2 }),
    /** 'year' | 'semester' | 'one_time' */
    periodType: varchar("period_type", { length: 20 }),
    /** 1-based installment number within periodType */
    periodNumber: integer("period_number"),
    /** e.g. "Payable ₹8,000 per semester" */
    note: varchar("note", { length: 255 }),
    sortOrder: integer("sort_order"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_fee_breakdown_structure").on(table.feeStructureId),
  ]
);

export const courseFeeBreakdownsRelations = relations(
  courseFeeBreakdowns,
  ({ one }) => ({
    feeStructure: one(courseFeeStructures, {
      fields: [courseFeeBreakdowns.feeStructureId],
      references: [courseFeeStructures.id],
    }),
  })
);

// ============================================
// Analytics / lead capture (main-site owned)
// ============================================
export const visitors = pgTable("visitors", {
  id: uuid("id").primaryKey().defaultRandom(),
  country: varchar("country", { length: 2 }),
  city: varchar("city", { length: 120 }),
  region: varchar("region", { length: 120 }),
  device: varchar("device", { length: 20 }),
  browser: varchar("browser", { length: 60 }),
  os: varchar("os", { length: 60 }),
  referrer: text("referrer"),
  landingPath: text("landing_path"),
  utmSource: varchar("utm_source", { length: 120 }),
  utmMedium: varchar("utm_medium", { length: 120 }),
  utmCampaign: varchar("utm_campaign", { length: 120 }),
  visitCount: integer("visit_count").default(1),
  firstSeen: timestamp("first_seen").defaultNow(),
  lastSeen: timestamp("last_seen").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: uuid("visitor_id"),
  event: varchar("event", { length: 40 }).default("page_view"),
  path: text("path"),
  entityType: varchar("entity_type", { length: 20 }),
  entityId: uuid("entity_id"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 255 }),
  message: text("message"),
  source: varchar("source", { length: 60 }),
  status: varchar("status", { length: 30 }).default("new"),
  visitorId: uuid("visitor_id"),
  universityId: uuid("university_id"),
  courseId: uuid("course_id"),
  utmSource: varchar("utm_source", { length: 120 }),
  utmMedium: varchar("utm_medium", { length: 120 }),
  utmCampaign: varchar("utm_campaign", { length: 120 }),
  utmContent: varchar("utm_content", { length: 120 }),
  utmTerm: varchar("utm_term", { length: 120 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============================================
// Type Exports
// ============================================
export type University = typeof universities.$inferSelect;
export type NewUniversity = typeof universities.$inferInsert;
export type CourseCategory = typeof courseCategories.$inferSelect;
export type NewCourseCategory = typeof courseCategories.$inferInsert;
export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type CourseFeeStructure = typeof courseFeeStructures.$inferSelect;
export type NewCourseFeeStructure = typeof courseFeeStructures.$inferInsert;
export type CourseFeeBreakdown = typeof courseFeeBreakdowns.$inferSelect;
export type NewCourseFeeBreakdown = typeof courseFeeBreakdowns.$inferInsert;
export type Visitor = typeof visitors.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
