import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const waitlistEntries = pgTable('waitlist_entries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  userType: varchar('user_type', { length: 20 }).notNull(), // 'buyer' | 'seller' | 'dealer'
  city: varchar('city', { length: 100 }).notNull(),
  consent: boolean('consent').notNull().default(false),
  locale: varchar('locale', { length: 10 }).notNull(),
  consentTimestamp: timestamp('consent_timestamp').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  consent: boolean('consent').notNull().default(false),
  locale: varchar('locale', { length: 10 }).notNull(),
  consentTimestamp: timestamp('consent_timestamp').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type WaitlistEntry = typeof waitlistEntries.$inferSelect;
export type NewWaitlistEntry = typeof waitlistEntries.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
