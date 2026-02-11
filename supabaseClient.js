import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://192.168.0.190:54323";
const supabaseKey = "sb_publishable_ACJWlzQHlzjBrEguHvfOxg_3BJgxAaH";

export const supabase = createClient(supabaseUrl, supabaseKey);
