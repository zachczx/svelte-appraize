CREATE TABLE "session_authorization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session" uuid,
	"user" varchar(50),
	"permissions" varchar(20)
);
--> statement-breakpoint
ALTER TABLE "session_authorization" ADD CONSTRAINT "session_authorization_session_sessions_id_fk" FOREIGN KEY ("session") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_authorization" ADD CONSTRAINT "session_authorization_user_users_id_fk" FOREIGN KEY ("user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;