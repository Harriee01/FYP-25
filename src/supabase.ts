// Add this at the very top to see all environment variables
// console.log("All environment variables:", import.meta.env);
// console.log("NODE_ENV:", import.meta.env.NODE_ENV);
// console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
// console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Environment variables are undefined!");
  console.error("supabaseUrl:", supabaseUrl);
  console.error("supabaseAnonKey:", supabaseAnonKey);
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
