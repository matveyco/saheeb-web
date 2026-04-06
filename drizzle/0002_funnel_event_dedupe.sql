DELETE FROM "funnel_events" AS "older"
USING "funnel_events" AS "newer"
WHERE "older"."event_id" IS NOT NULL
  AND "older"."event_id" = "newer"."event_id"
  AND "older"."id" < "newer"."id";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "funnel_events_event_id_unique"
  ON "funnel_events" ("event_id");
