CREATE TABLE "foods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"protein" numeric(10, 2) NOT NULL,
	"fat" numeric(10, 2) NOT NULL,
	"carbs" numeric(10, 2) NOT NULL,
	"calories" integer NOT NULL,
	"measure_type" varchar(10) DEFAULT 'gram' NOT NULL,
	"unit_name" varchar(255),
	"unit_grams" numeric(10, 2),
	"preparation" varchar(10),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "log_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"food_name" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"unit" varchar(50) DEFAULT 'g' NOT NULL,
	"protein" numeric(10, 2) NOT NULL,
	"fat" numeric(10, 2) NOT NULL,
	"carbs" numeric(10, 2) NOT NULL,
	"calories" integer NOT NULL,
	"preparation" varchar(50) DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
