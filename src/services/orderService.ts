import {
  BASE_CURRENCY,
  isValidPurchaseAmount,
  SupportedCurrency,
} from "@/constants/businessConfig";

import {
  CourierWeight,
  PickupZone,
  ServiceType,
} from "@/business/quoteEngine/models";

import { supabase } from "../lib/supabase";
import { getAddressById } from "./addressService";
import { generateAutomaticQuote } from "./quoteEngineService";

const ORDER_STATUS_VALIDATION = "VALIDATION";

async function getAuthenticatedUser() {
  const { data: sessionData, error } =
    await supabase.auth.getSession();

  if (error) {
    return {
      user: null,
      error,
    };
  }

  const user = sessionData.session?.user ?? null;

  if (!user) {
    return {
      user: null,
      error: new Error(
        "No authenticated user found",
      ),
    };
  }

  return {
    user,
    error: null,
  };
}

type CreateOrderInput = {
  description: string;
  addressId: string;
  serviceType: ServiceType;

  pickupZone: PickupZone;
  pickupLocation?: string;

  paymentMethod?: "SINPE" | "CASH";
  cashPaymentAmount?: number;
  cashPaymentCurrency?: "CRC" | "USD";

  currency?: SupportedCurrency;
  courierWeight?: CourierWeight;
  estimatedPurchaseAmount?: number;
  foodOrderPaid?: boolean;
  courierOrderPaid?: boolean;
};

type DeliveryRelation = {
  id: string;
  status: string;
};

type OrderWithDeliveries = {
  id: string;
  description: string;
  status: string;
  created_at: string;
  deliveries?:
    | DeliveryRelation[]
    | DeliveryRelation
    | null;
  [key: string]: unknown;
};

export async function createOrder(
  input: CreateOrderInput,
) {
  console.warn("CREATE ORDER INPUT:", input);

  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const currency =
    input.currency ?? BASE_CURRENCY;

  if (!input.paymentMethod) {
    return {
      data: null,
      error: new Error(
        "Debe seleccionar un método de pago.",
      ),
    };
  }

  if (
    input.paymentMethod === "CASH" &&
    (typeof input.cashPaymentAmount !==
      "number" ||
      !Number.isFinite(
        input.cashPaymentAmount,
      ) ||
      input.cashPaymentAmount <= 0)
  ) {
    return {
      data: null,
      error: new Error(
        "Debe indicar con cuánto va a pagar.",
      ),
    };
  }

  if (
    input.paymentMethod === "CASH" &&
    input.cashPaymentCurrency !== "CRC" &&
    input.cashPaymentCurrency !== "USD"
  ) {
    return {
      data: null,
      error: new Error(
        "Debe seleccionar la moneda del pago en efectivo.",
      ),
    };
  }

  if (!input.pickupZone) {
    return {
      data: null,
      error: new Error(
        "Debe seleccionar la zona de preferencia o retiro.",
      ),
    };
  }

  if (!input.pickupLocation?.trim()) {
    return {
      data: null,
      error: new Error(
        "Debe indicar el lugar de preferencia o retiro.",
      ),
    };
  }

  if (
    input.serviceType ===
      "GENERAL_MESSAGING" &&
    !input.courierWeight
  ) {
    return {
      data: null,
      error: new Error(
        "Debe seleccionar el peso aproximado de la mensajerÃa.",
      ),
    };
  }

  if (
    input.serviceType ===
      "GENERAL_MESSAGING" &&
    typeof input.courierOrderPaid !==
      "boolean"
  ) {
    return {
      data: null,
      error: new Error(
        "Debe indicar si el paquete o producto ya fue pagado.",
      ),
    };
  }

  if (
    input.serviceType === "FOOD_PICKUP" &&
    typeof input.foodOrderPaid !==
      "boolean"
  ) {
    return {
      data: null,
      error: new Error(
        "Debe indicar si el pedido de comida ya fue pagado.",
      ),
    };
  }

  const requiresEstimatedPurchaseAmount =
    input.serviceType === "SUPERMARKET" ||
    input.serviceType === "PHARMACY" ||
    (input.serviceType === "FOOD_PICKUP" &&
      input.foodOrderPaid === false);

  if (
    requiresEstimatedPurchaseAmount &&
    typeof input.estimatedPurchaseAmount !==
      "number"
  ) {
    return {
      data: null,
      error: new Error(
        "Debe indicar el monto estimado de la compra.",
      ),
    };
  }

  if (
    requiresEstimatedPurchaseAmount &&
    input.estimatedPurchaseAmount !==
      undefined &&
    !isValidPurchaseAmount(
      input.estimatedPurchaseAmount,
      currency,
    )
  ) {
    return {
      data: null,
      error: new Error(
        "El monto estimado estÃ¡ fuera del rango permitido.",
      ),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      address_id: input.addressId,

      description: input.description,
      service_type: input.serviceType,

      pickup_zone: input.pickupZone,

      pickup_location:
        input.pickupLocation?.trim() || null,

      payment_method:
        input.paymentMethod,

      cash_payment_amount:
        input.paymentMethod === "CASH"
          ? (input.cashPaymentAmount ?? null)
          : null,

      cash_payment_currency:
        input.paymentMethod === "CASH"
          ? (input.cashPaymentCurrency ?? null)
          : null,

      courier_weight:
        input.serviceType ===
        "GENERAL_MESSAGING"
          ? (input.courierWeight ?? null)
          : null,

      estimated_purchase_amount:
        requiresEstimatedPurchaseAmount
          ? (input.estimatedPurchaseAmount ??
            null)
          : null,

      estimated_purchase_currency:
        requiresEstimatedPurchaseAmount
          ? currency
          : null,

      food_order_paid:
        input.serviceType === "FOOD_PICKUP"
          ? input.foodOrderPaid
          : null,

      courier_order_paid:
        input.serviceType ===
        "GENERAL_MESSAGING"
          ? input.courierOrderPaid
          : null,

      status: ORDER_STATUS_VALIDATION,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      data,
      error,
    };
  }

  console.log("ORDER CREATED:", data);

  const {
    data: address,
    error: addressError,
  } = await getAddressById(
    input.addressId,
  );

  console.log("ADDRESS FOUND:", address);
  console.log(
    "ADDRESS ERROR:",
    addressError,
  );

  if (addressError || !address) {
    return {
      data,
      error:
        addressError ??
        new Error(
          "No se encontrÃ³ la direcciÃ³n del pedido.",
        ),
    };
  }

  const serviceType =
    data.service_type as ServiceType;

  const locationText = [
    address.address_line,
    address.reference,
    address.label,
  ]
    .filter(Boolean)
    .join(" ");

  console.log(
    "LOCATION RECEIVED:",
    locationText,
  );

  console.log(
    "PICKUP ZONE RECEIVED:",
    input.pickupZone,
  );

  console.log(
    "COURIER WEIGHT RECEIVED:",
    input.courierWeight,
  );

  const latitude =
    Number(address.latitude);

  const longitude =
    Number(address.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return {
      data,
      error: new Error(
        "La direcciÃ³n seleccionada no tiene coordenadas vÃ¡lidas.",
      ),
    };
  }

  console.log("ORDER COORDINATES:", {
    latitude,
    longitude,
  });

  const quoteResult =
    await generateAutomaticQuote({
      orderId: data.id,
      description: data.description,
      serviceType,
      currency,

      latitude,
      longitude,

      locationText,

      pickupZone: input.pickupZone,

      courierWeight:
        serviceType ===
        "GENERAL_MESSAGING"
          ? input.courierWeight
          : undefined,
    });

  console.log(
    "AUTOMATIC QUOTE RESULT:",
    quoteResult,
  );

  if (quoteResult.error) {
    console.error(
      "Quote generation failed:",
      quoteResult.error,
    );

    return {
      data,
      error:
        quoteResult.error instanceof Error
          ? quoteResult.error
          : new Error(
              "No se pudo generar la cotizaciÃ³n automÃ¡tica.",
            ),
    };
  }

  return {
    data,
    error: null,
  };
}

export async function getMyOrders() {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: [],
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        deliveries (
          id,
          status
        )
      `,
    )
    .eq("profile_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return {
      data: [],
      error,
    };
  }

  const normalizedOrders = (
    (data ?? []) as OrderWithDeliveries[]
  ).map((order) => {
    const delivery =
      Array.isArray(order.deliveries)
        ? (order.deliveries[0] ?? null)
        : (order.deliveries ?? null);

    const orderStatus = String(
      order.status,
    )
      .trim()
      .toUpperCase();

    const deliveryStatus =
      delivery?.status
        ? String(delivery.status)
            .trim()
            .toUpperCase()
        : null;

    let displayStatus = orderStatus;

    if (deliveryStatus === "PENDING") {
      displayStatus = orderStatus;
    }

    if (
      deliveryStatus === "IN_PROGRESS" ||
      deliveryStatus === "ON_ROUTE" ||
      deliveryStatus === "DELIVERED" ||
      deliveryStatus === "CANCELLED"
    ) {
      displayStatus = deliveryStatus;
    }

    return {
      ...order,
      status: displayStatus,
      delivery_id: delivery?.id ?? null,
      delivery_status:
        deliveryStatus,
    };
  });

  console.log(
    "MY ORDERS RESOLVED STATUSES:",
    normalizedOrders.map((order) => ({
      id: order.id,

      orderStatus:
        (
          (data ??
            []) as OrderWithDeliveries[]
        ).find(
          (item) =>
            item.id === order.id,
        )?.status ?? null,

      deliveryStatus:
        order.delivery_status,

      displayStatus:
        order.status,
    })),
  );

  return {
    data: normalizedOrders,
    error: null,
  };
}

export async function getOrderById(
  orderId: string,
) {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        *,
        addresses (
          address_line,
          reference,
          label,
          latitude,
          longitude
        )
      `,
    )
    .eq("id", orderId)
    .eq("profile_id", user.id)
    .single();

  return {
    data,
    error,
  };
}

export async function cancelAcceptedOrder(
  orderId: string,
) {
  const { user, error: authError } =
    await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error:
        authError ??
        new Error(
          "No hay una sesiÃ³n activa.",
        ),
    };
  }

  const { data, error } =
    await supabase.rpc(
      "cancel_accepted_order",
      {
        target_order_id: orderId,
      },
    );

  if (error) {
    console.error(
      "CANCEL ACCEPTED ORDER RPC ERROR:",
      error,
    );

    return {
      data: null,
      error,
    };
  }

  return {
    data,
    error: null,
  };
   }