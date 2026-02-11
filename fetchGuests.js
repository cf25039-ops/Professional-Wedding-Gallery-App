import { supabase } from "./supabaseClient.js";

const fetchGuests = async () => {
  const { data, error } = await supabase.from("guests").select("*");

  console.log("Data:", data);
  console.log("Error:", error);
};

fetchGuests();
