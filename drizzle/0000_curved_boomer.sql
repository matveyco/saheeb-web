CREATE TABLE IF NOT EXISTS "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"subject" varchar(255),
	"message" text NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	"locale" varchar(10) NOT NULL,
	"consent_timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funnel_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_name" varchar(80) NOT NULL,
	"path" varchar(255) NOT NULL,
	"page_group" varchar(80),
	"project" varchar(80),
	"site_locale" varchar(10) NOT NULL,
	"user_type" varchar(20),
	"cta_location" varchar(120),
	"destination_path" varchar(255),
	"form_name" varchar(120),
	"error_stage" varchar(80),
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"utm_content" varchar(255),
	"referrer" text,
	"landing_path" varchar(255),
	"country_code" varchar(8),
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"user_type" varchar(20) NOT NULL,
	"city" varchar(100) NOT NULL,
	"consent" boolean DEFAULT false NOT NULL,
	"locale" varchar(10) NOT NULL,
	"utm_source" varchar(255),
	"utm_medium" varchar(255),
	"utm_campaign" varchar(255),
	"utm_content" varchar(255),
	"referrer" text,
	"landing_path" varchar(255),
	"country_code" varchar(8),
	"consent_timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ALTER COLUMN "phone" DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "utm_source" varchar(255);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "utm_medium" varchar(255);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "utm_campaign" varchar(255);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "utm_content" varchar(255);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "referrer" text;
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "landing_path" varchar(255);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "country_code" varchar(8);
