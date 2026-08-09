import { supabase } from "../lib/supabase";

export const DELIVERY_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  ON_ROUTE: "ON_ROUTE",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type DeliveryStatus =
  (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export type DeliveryOrderDetails = {
  id: string;
  description: string | null;
  service_type: string | null;

  pickup_location: string | null;
  courier_weight: string | null;
  payment_method: string | null;
  food_order_paid: boolean | null;
  courier_order_paid: boolean | null;
  estimated_purchase_amount: number | null;
  estimated_purchase_currency: string | null;

  customer: {
    full_name: string | null;
    phone: string | null;
  } | null;

  address: {
    address_line: string | null;
    reference: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;

  quote: {
    total: number | null;
    currency: string | null;
  } | null;
};

export type DeliveryRow = {
  id: string;
  order_id: string;
  status: DeliveryStatus;
  started_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  order?: DeliveryOrderDetails | null;
};

function validateId(id: string, fieldName: string) {
  if (!id.trim()) {
    throw new Error(`A valid ${fieldName} is required`);
  }
}

export async function getDeliveryById(deliveryId: string) {
  validateId(deliveryId, "deliveryId");

  const { data: deliveryData, error: deliveryError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", deliveryId)
    .maybeSingle();

  console.log(
    "DELIVERY ONLY:",
    JSON.stringify(deliveryData, null, 2),
  );

  console.log("DELIVERY ERROR:", deliveryError);

  if (deliveryError || !deliveryData) {
    return {
      data: null,
      error:
        deliveryError ??
        new Error("No se encontró la entrega."),
    };
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", deliveryData.order_id)
    .maybeSingle();

  console.log(
    "ORDER ONLY:",
    JSON.stringify(orderData, null, 2),
  );

  console.log("ORDER ERROR:", orderError);

  if (orderError) {
    return {
      data: null,
      error: orderError,
    };
  }

  if (!orderData) {
    return {
      data: null,
      error: new Error(
        "No se encontró la orden asociada a la entrega.",
      ),
    };
  }

  const { data: customerData, error: customerError } =
    await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .eq("id", orderData.profile_id)
      .maybeSingle();

  console.log(
    "CUSTOMER ONLY:",
    JSON.stringify(customerData, null, 2),
  );

  console.log("CUSTOMER ERROR:", customerError);

  if (customerError) {
    return {
      data: null,
      error: customerError,
    };
  }

  const { data: addressData, error: addressError } =
    await supabase
      .from("addresses")
      .select(
        "id, address_line, reference, latitude, longitude",
      )
      .eq("id", orderData.address_id)
      .maybeSingle();

  console.log(
    "ADDRESS ONLY:",
    JSON.stringify(addressData, null, 2),
  );

  console.log("ADDRESS ERROR:", addressError);

  if (addressError) {
    return {
      data: null,
      error: addressError,
    };
  }

  const { data: quoteData, error: quoteError } =
    await supabase.rpc(
      "get_driver_delivery_quote_total",
      {
        p_delivery_id: deliveryId,
      },
    );

  console.log(
    "QUOTE RPC RESULT:",
    JSON.stringify(quoteData, null, 2),
  );

  console.log("QUOTE RPC ERROR:", quoteError);

  if (quoteError) {
    return {
      data: null,
      error: quoteError,
    };
  }

  const acceptedQuote =
    Array.isArray(quoteData) &&
    quoteData.length > 0
      ? quoteData[0]
      : null;

  const normalizedDelivery: DeliveryRow = {
    id: deliveryData.id,
    order_id: deliveryData.order_id,
    status:
      deliveryData.status as DeliveryStatus,
    started_at:
      deliveryData.started_at,
    delivered_at:
      deliveryData.delivered_at,
    created_at:
      deliveryData.created_at,
    updated_at:
      deliveryData.updated_at,

    order: {
      id: orderData.id,

      description:
        orderData.description ?? null,

      service_type:
        orderData.service_type ?? null,

      pickup_location:
        orderData.pickup_location ?? null,

      courier_weight:
        orderData.courier_weight ?? null,

      payment_method:
        orderData.payment_method ?? null,

      food_order_paid:
        orderData.food_order_paid ?? null,

      courier_order_paid:
        orderData.courier_order_paid ?? null,

      estimated_purchase_amount:
        orderData.estimated_purchase_amount ??
        null,

      estimated_purchase_currency:
        orderData.estimated_purchase_currency ??
        null,

      customer: customerData
        ? {
            full_name:
              customerData.full_name ?? null,

            phone:
              customerData.phone ?? null,
          }
        : null,

      address: addressData
        ? {
            address_line:
              addressData.address_line ?? null,

            reference:
              addressData.reference ?? null,

            latitude:
              addressData.latitude !== null
                ? Number(
                    addressData.latitude,
                  )
                : null,

            longitude:
              addressData.longitude !== null
                ? Number(
                    addressData.longitude,
                  )
                : null,
          }
        : null,

      quote: acceptedQuote
        ? {
            total:
              acceptedQuote.total !== null
                ? Number(
                    acceptedQuote.total,
                  )
                : null,

            currency:
              acceptedQuote.currency ??
              null,
          }
        : null,
    },
  };

  return {
    data: normalizedDelivery,
    error: null,
  };
}

export async function getDeliveryByOrderId(
  orderId: string,
) {
  validateId(orderId, "orderId");

  const { data, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  return {
    data:
      data as DeliveryRow | null,
    error,
  };
}

export async function createDeliveryForOrder(
  orderId: string,
) {
  validateId(orderId, "orderId");

  const {
    data: existingDelivery,
    error: existingDeliveryError,
  } = await getDeliveryByOrderId(
    orderId,
  );

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

  const now =
    new Date().toISOString();

  const { data, error } =
    await supabase
      .from("deliveries")
      .insert({
        order_id: orderId,
        status:
          DELIVERY_STATUS.PENDING,
        updated_at: now,
      })
      .select()
      .maybeSingle();

  return {
    data:
      data as DeliveryRow | null,
    error,
  };
}

export async function startDelivery(
  deliveryId: string,
) {
  validateId(
    deliveryId,
    "deliveryId",
  );

  const { data, error } =
    await supabase.rpc(
      "transition_driver_delivery",
      {
        p_delivery_id:
          deliveryId,

        p_target_status:
          DELIVERY_STATUS.IN_PROGRESS,
      },
    );

  if (error) {
    return {
      data: null,
      error,
    };
  }

  console.log(
    "START DELIVERY RPC RESULT:",
    data,
  );

  return await getDeliveryById(
    deliveryId,
  );
}

export async function startDeliveryRoute(
  deliveryId: string,
) {
  validateId(
    deliveryId,
    "deliveryId",
  );

  const { data, error } =
    await supabase.rpc(
      "transition_driver_delivery",
      {
        p_delivery_id:
          deliveryId,

        p_target_status:
          DELIVERY_STATUS.ON_ROUTE,
      },
    );

  if (error) {
    return {
      data: null,
      error,
    };
  }

  console.log(
    "START DELIVERY ROUTE RPC RESULT:",
    data,
  );

  return await getDeliveryById(
    deliveryId,
  );
}

export async function completeDelivery(
  deliveryId: string,
) {
  validateId(
    deliveryId,
    "deliveryId",
  );

  const { data, error } =
    await supabase.rpc(
      "transition_driver_delivery",
      {
        p_delivery_id:
          deliveryId,

        p_target_status:
          DELIVERY_STATUS.DELIVERED,
      },
    );

  if (error) {
    return {
      data: null,
      error,
    };
  }

  console.log(
    "COMPLETE DELIVERY RPC RESULT:",
    data,
  );

  return await getDeliveryById(
    deliveryId,
  );
}

export async function cancelDelivery(
  deliveryId: string,
) {
  validateId(
    deliveryId,
    "deliveryId",
  );

  const { data, error } =
    await supabase.rpc(
      "transition_driver_delivery",
      {
        p_delivery_id:
          deliveryId,

        p_target_status:
          DELIVERY_STATUS.CANCELLED,
      },
    );

  if (error) {
    return {
      data: null,
      error,
    };
  }

  console.log(
    "CANCEL DELIVERY RPC RESULT:",
    data,
  );

  return await getDeliveryById(
    deliveryId,
  );
}