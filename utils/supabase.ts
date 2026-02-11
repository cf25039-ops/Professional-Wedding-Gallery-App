import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      guest_entries: {
        Row: {
          id: string;
          guest_name: string;
          message: string;
          media_url: string;
          media_type: "image" | "video";
          tags: string[] | null;
          created_at: string;
        };
        Insert: {
          guest_name: string;
          message: string;
          media_url: string;
          media_type: "image" | "video";
          tags?: string[] | null;
        };
        Update: {
          guest_name?: string;
          message?: string;
          media_url?: string;
          media_type?: "image" | "video";
          tags?: string[] | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey
);
