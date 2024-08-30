import supabase from "./supabase";

export async function getGuests() {
  const { data, error } = await supabase.from("guests").select("*");

  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return data;
}

export async function getGuestByEmail(email) {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .ilike("email", `%${email}%`)
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest with this email was not found");
  }

  return data;
}

export async function createGuest(newGuest) {
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newGuest }])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }
  return data;
}

export async function deleteGuest(id) {
  const { error } = await supabase.from("guests").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Guest could not be deleted");
  }
}
