import { supabase } from "../lib/supabase";

const DELIVERY_STATUS_PENDING = "PENDING";

export async function getDeliveryByOrderId(orderId: string) {
  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  return { data, error };
}

export async function createDeliveryForOrder(orderId: string) {
  const { data: existingDelivery, error: existingDeliveryError } =
    await getDeliveryByOrderId(orderId);

  if (existingDeliveryError) {
    return {
      data: null,
      error: existingDeliveryError,
    };
  }

  if (existingDelivery) {
    return {
      data: existingDelivery,
      error: null,
    };
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("deliveries")
    .insert({
      order_id: orderId,
      status: DELIVERY_STATUS_PENDING,
      updated_at: now,
    })
    .select()
    .maybeSingle();

  return { data, error };
}