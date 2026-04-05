import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const waitlistEntries = pgTable('waitlist_entries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  userType: varchar('user_type', { length: 20 }).notNull(), // 'buyer' | 'seller' | legacy 'dealer'
  city: varchar('city', { length: 100 }).notNull(),
  consent: boolean('consent').notNull().default(false),
  locale: varchar('locale', { length: 10 }).notNull(),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  referrer: text('referrer'),
  landingPath: varchar('landing_path', { length: 255 }),
  countryCode: varchar('country_code', { length: 8 }),
  anonymousId: varchar('anonymous_id', { length: 80 }),
  sessionId: varchar('session_id', { length: 80 }),
  pageVariant: varchar('page_variant', { length: 40 }),
  eventId: varchar('event_id', { length: 80 }),
  intentSource: varchar('intent_source', { length: 120 }),
  consentTimestamp: timestamp('consent_timestamp').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const funnelEvents = pgTable('funnel_events', {
  id: serial('id').primaryKey(),
  eventName: varchar('event_name', { length: 80 }).notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  pageGroup: varchar('page_group', { length: 80 }),
  project: varchar('project', { length: 80 }),
  siteLocale: varchar('site_locale', { length: 10 }).notNull(),
  userType: varchar('user_type', { length: 20 }),
  ctaLocation: varchar('cta_location', { length: 120 }),
  destinationPath: varchar('destination_path', { length: 255 }),
  formName: varchar('form_name', { length: 120 }),
  errorStage: varchar('error_stage', { length: 80 }),
  utmSource: varchar('utm_source', { length: 255 }),
  utmMedium: varchar('utm_medium', { length: 255 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  referrer: text('referrer'),
  landingPath: varchar('landing_path', { length: 255 }),
  countryCode: varchar('country_code', { length: 8 }),
  anonymousId: varchar('anonymous_id', { length: 80 }),
  sessionId: varchar('session_id', { length: 80 }),
  pageVariant: varchar('page_variant', { length: 40 }),
  eventId: varchar('event_id', { length: 80 }),
  intentSource: varchar('intent_source', { length: 120 }),
  payload: jsonb('payload')
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default(sql`'{}'::jsonb`),
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
export type FunnelEvent = typeof funnelEvents.$inferSelect;
export type NewFunnelEvent = typeof funnelEvents.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
