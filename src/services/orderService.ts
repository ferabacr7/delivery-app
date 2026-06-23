import { supabase } from "../lib/supabase";

export async function createOrder(description: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  console.log("USER LOGUEADO:", userData.user);
  console.log("USER ID:", userData.user?.id);

  if (userError || !userData.user) {
    return {
      data: null,
      error: userError ?? new Error("No authenticated user found"),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      profile_id: userData.user.id,
      description,
      status: "VALIDATION",
    })
    .select()
    .single();

  return { data, error };
}

export async function getMyOrders() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return {
      data: null,
      error: userError ?? new Error("No authenticated user found"),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  return { data, error };
}
