import { supabase } from "../lib/supabase";

const ADMIN_ORDER_SELECT = `
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
    subtotal,
    delivery_fee,
    total,
    notes,
    status,
    created_at
  )
`;

export async function getAllOrders() {
  return await supabase
    .from("orders")
    .select(ADMIN_ORDER_SELECT)
    .order("created_at", { ascending: false });
}

export async function getAdminOrderById(orderId: string) {
  return await supabase
    .from("orders")
    .select(ADMIN_ORDER_SELECT)
    .eq("id", orderId)
    .maybeSingle();
}