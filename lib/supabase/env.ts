function readRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseUrl() {
  return readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getSupabasePublishableKey() {
  return readRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}

export function getSupabaseServiceRoleKey() {
  return readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}
