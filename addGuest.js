import { supabase } from "./supabaseClient.js";

const addGuest = async () => {
  const { data, error } = await supabase
    .from("guests")
    .insert({
      name: "John Doe",
      phone: "0123456789",
      attending: true
    })
    .select();

  if (error) {
    console.error("Error adding guest:", error.message);
    return;
  }

  console.log("Guest added:", data);
};

addGuest();
