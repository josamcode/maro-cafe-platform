CREATE TABLE "intent_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"context" text NOT NULL,
	"branch_slug" text,
	"product_id" uuid,
	"offer_id" uuid,
	"has_results" boolean,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offer_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offer_id" uuid NOT NULL,
	"actor_id" uuid NOT NULL,
	"before" jsonb,
	"after" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"content" jsonb NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"context" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	CONSTRAINT "offer_dates_ordered" CHECK ("offers"."ends_on" >= "offers"."starts_on")
);
--> statement-breakpoint
ALTER TABLE "offer_audit" ADD CONSTRAINT "offer_audit_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer_audit" ADD CONSTRAINT "offer_audit_actor_id_staff_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_approved_by_staff_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."staff_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "intent_events_time_idx" ON "intent_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "offers_schedule_idx" ON "offers" USING btree ("published","starts_on","ends_on");