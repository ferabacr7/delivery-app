import { supabase } from "../lib/supabase";

export async function createOrder(description: string) {
  const { data: sessionData } = await supabase.auth.getSession();

  const user = sessionData.session?.user;

  if (!user) {
    return {
      data: null,
      error: new Error("No authenticated user found"),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      description,
      status: "PENDING",
    })
    .select()
    .single();

  return { data, error };
}

export async function getMyOrders() {
  const { data: sessionData } = await supabase.auth.getSession();

  const user = sessionData.session?.user;

  if (!user) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", user.id)
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
