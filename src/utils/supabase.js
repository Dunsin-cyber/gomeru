"use client";
import { createClient } from "@supabase/supabase-js";

// console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
// console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_KEY);

// Use environment variables
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase clientT
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;