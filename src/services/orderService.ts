import {
  BASE_CURRENCY,
  isValidPurchaseAmount,
  SupportedCurrency,
} from "@/constants/businessConfig";

import { CourierWeight, ServiceType } from "@/business/quoteEngine/models";

import { supabase } from "../lib/supabase";
import { getAddressById } from "./addressService";
import { generateAutomaticQuote } from "./quoteEngineService";

const ORDER_STATUS_VALIDATION = "VALIDATION";

async function getAuthenticatedUser() {
  const { data: sessionData, error } = await supabase.auth.getSession();

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
      error: new Error("No authenticated user found"),
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

  currency?: SupportedCurrency;
  courierWeight?: CourierWeight;
  estimatedPurchaseAmount?: number;
  foodOrderPaid?: boolean;
};

export async function createOrder(input: CreateOrderInput) {
  console.warn("CREATE ORDER INPUT:", input);

  const { user, error: authError } = await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const currency = input.currency ?? BASE_CURRENCY;

  if (input.serviceType === "GENERAL_MESSAGING" && !input.courierWeight) {
    return {
      data: null,
      error: new Error("Debe seleccionar el peso aproximado de la mensajería."),
    };
  }

  if (
    input.serviceType === "FOOD_PICKUP" &&
    typeof input.foodOrderPaid !== "boolean"
  ) {
    return {
      data: null,
      error: new Error("Debe indicar si el pedido de comida ya fue pagado."),
    };
  }

  const requiresEstimatedPurchaseAmount =
    input.serviceType === "SUPERMARKET" ||
    input.serviceType === "PHARMACY" ||
    (input.serviceType === "FOOD_PICKUP" && input.foodOrderPaid === false);

  if (
    requiresEstimatedPurchaseAmount &&
    typeof input.estimatedPurchaseAmount !== "number"
  ) {
    return {
      data: null,
      error: new Error("Debe indicar el monto estimado de la compra."),
    };
  }

  if (
    requiresEstimatedPurchaseAmount &&
    input.estimatedPurchaseAmount !== undefined &&
    !isValidPurchaseAmount(input.estimatedPurchaseAmount, currency)
  ) {
    return {
      data: null,
      error: new Error("El monto estimado está fuera del rango permitido."),
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      address_id: input.addressId,
      description: input.description,
      service_type: input.serviceType,

      courier_weight:
        input.serviceType === "GENERAL_MESSAGING"
          ? (input.courierWeight ?? null)
          : null,

      estimated_purchase_amount: requiresEstimatedPurchaseAmount
        ? (input.estimatedPurchaseAmount ?? null)
        : null,

      estimated_purchase_currency: requiresEstimatedPurchaseAmount
        ? currency
        : null,

      food_order_paid:
        input.serviceType === "FOOD_PICKUP" ? input.foodOrderPaid : null,

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

  const { data: address, error: addressError } = await getAddressById(
    input.addressId,
  );

  console.log("ADDRESS FOUND:", address);
  console.log("ADDRESS ERROR:", addressError);

  if (addressError || !address) {
    return {
      data,
      error:
        addressError ?? new Error("No se encontró la dirección del pedido."),
    };
  }

  const serviceType = data.service_type as ServiceType;

  const locationText = [address.address_line, address.reference, address.label]
    .filter(Boolean)
    .join(" ");

  console.log("LOCATION RECEIVED:", locationText);

  console.log("COURIER WEIGHT RECEIVED:", input.courierWeight);

  const latitude = Number(address.latitude);
  const longitude = Number(address.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return {
      data,
      error: new Error(
        "La dirección seleccionada no tiene coordenadas válidas.",
      ),
    };
  }

  console.log("ORDER COORDINATES:", {
    latitude,
    longitude,
  });

  const quoteResult = await generateAutomaticQuote({
    orderId: data.id,
    description: data.description,
    serviceType,
    currency,

    latitude,
    longitude,

    // Se conserva únicamente como referencia descriptiva.
    locationText,

    courierWeight:
      serviceType === "GENERAL_MESSAGING" ? input.courierWeight : undefined,
  });

  console.log("AUTOMATIC QUOTE RESULT:", quoteResult);

  if (quoteResult.error) {
    console.error("Quote generation failed:", quoteResult.error);

    return {
      data,
      error:
        quoteResult.error instanceof Error
          ? quoteResult.error
          : new Error("No se pudo generar la cotización automática."),
    };
  }

  return {
    data,
    error: null,
  };
}

export async function getMyOrders() {
  const { user, error: authError } = await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: [],
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("profile_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  return {
    data,
    error,
  };
}

export async function getOrderById(orderId: string) {
  const { user, error: authError } = await getAuthenticatedUser();

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
