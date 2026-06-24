import { supabase } from "../lib/supabase";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (
        full_name,
        phone
      ),
      addresses (
        label,
        address_line,
        reference
      ),
      quotes (
        id,
        amount,
        subtotal,
        delivery_fee,
        total,
        notes,
        status,
        created_at
      )
    `,
    )
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getAdminOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (
        full_name,
        phone
      ),
      addresses (
        label,
        address_line,
        reference
      ),
      quotes (
        id,
        amount,
        subtotal,
        delivery_fee,
        total,
        notes,
        status,
        created_at
      )
    `,
    )
    .eq("id", orderId)
    .maybeSingle();

  return { data, error };
}
