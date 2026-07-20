import { supabase } from "../lib/supabase";

export const DELIVERY_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type DeliveryStatus =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export type DeliveryRow = {
  id: string;
  order_id: string;
  status: DeliveryStatus;
  started_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

function validateId(id: string, fieldName: string) {
  if (!id.trim()) {
    throw new Error(`A valid ${fieldName} is required`);
  }
}

export async function getDeliveryById(deliveryId: string) {
  validateId(deliveryId, "deliveryId");

  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", deliveryId)
    .maybeSingle();

  return {
    data: data as DeliveryRow | null,
    error,
  };
}

export async function getDeliveryByOrderId(orderId: string) {
  validateId(orderId, "orderId");

  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  return {
    data: data as DeliveryRow | null,
    error,
  };
}

export async function createDeliveryForOrder(orderId: string) {
  validateId(orderId, "orderId");

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
      status: DELIVERY_STATUS.PENDING,
      updated_at: now,
    })
    .select()
    .single();

  return {
    data: data as DeliveryRow | null,
    error,
  };
}

export async function startDelivery(deliveryId: string) {
  validateId(deliveryId, "deliveryId");

  const { data: currentDelivery, error: readError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", deliveryId)
    .maybeSingle();

  console.log("START DELIVERY CURRENT ROW:", currentDelivery);

  console.log("START DELIVERY EXPECTED STATUS:", DELIVERY_STATUS.PENDING);

  if (readError) {
    return {
      data: null,
      error: readError,
    };
  }

  if (!currentDelivery) {
    return {
      data: null,
      error: new Error("No se encontró la entrega."),
    };
  }

  const currentStatus = String(currentDelivery.status).trim().toUpperCase();

  if (currentStatus !== DELIVERY_STATUS.PENDING) {
    return {
      data: null,
      error: new Error(
        `La entrega está en estado ${currentDelivery.status}, no en PENDING.`,
      ),
    };
  }

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("deliveries")
    .update({
      status: DELIVERY_STATUS.IN_PROGRESS,
      started_at: now,
      updated_at: now,
    })
    .eq("id", deliveryId)
    .select()
    .single();

  console.log("START DELIVERY UPDATED ROW:", data);

  return {
    data: data as DeliveryRow | null,
    error,
  };
}

export async function completeDelivery(deliveryId: string) {
  validateId(deliveryId, "deliveryId");

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("deliveries")
    .update({
      status: DELIVERY_STATUS.DELIVERED,
      delivered_at: now,
      updated_at: now,
    })
    .eq("id", deliveryId)
    .eq("status", DELIVERY_STATUS.IN_PROGRESS)
    .select()
    .maybeSingle();

  return {
    data: data as DeliveryRow | null,
    error,
  };
}

export async function cancelDelivery(deliveryId: string) {
  validateId(deliveryId, "deliveryId");

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("deliveries")
    .update({
      status: DELIVERY_STATUS.CANCELLED,
      updated_at: now,
    })
    .eq("id", deliveryId)
    .neq("status", DELIVERY_STATUS.DELIVERED)
    .select()
    .maybeSingle();

  return {
    data: data as DeliveryRow | null,
    error,
  };
}
