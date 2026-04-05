ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "anonymous_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "session_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "page_variant" varchar(40);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "event_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "waitlist_entries" ADD COLUMN IF NOT EXISTS "intent_source" varchar(120);
--> statement-breakpoint
ALTER TABLE "funnel_events" ADD COLUMN IF NOT EXISTS "anonymous_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "funnel_events" ADD COLUMN IF NOT EXISTS "session_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "funnel_events" ADD COLUMN IF NOT EXISTS "page_variant" varchar(40);
--> statement-breakpoint
ALTER TABLE "funnel_events" ADD COLUMN IF NOT EXISTS "event_id" varchar(80);
--> statement-breakpoint
ALTER TABLE "funnel_events" ADD COLUMN IF NOT EXISTS "intent_source" varchar(120);
