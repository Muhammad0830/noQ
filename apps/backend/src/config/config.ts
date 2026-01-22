import "dotenv/config";

export const env = {
  PORT: process.env.PORT || "3001",
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY!,
};
