import { supabase } from "../lib/supabase";
import { generateAutomaticQuote } from "./quoteEngineService";
import { ServiceType } from "@/business/quoteEngine/models";
import { getAddressById } from "./addressService";

const ORDER_STATUS_VALIDATION = "VALIDATION";

async function getAuthenticatedUser() {
  const { data: sessionData, error } = await supabase.auth.getSession();

  if (error) {
    return { user: null, error };
  }

  const user = sessionData.session?.user ?? null;

  if (!user) {
    return {
      user: null,
      error: new Error("No authenticated user found"),
    };
  }

  return { user, error: null };
}

type CreateOrderInput = {
  description: string;
  addressId: string;
  serviceType: ServiceType;
};

export async function createOrder(input: CreateOrderInput) {
  const { user, error: authError } = await getAuthenticatedUser();

  if (authError || !user) {
    return {
      data: null,
      error: authError,
    };
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      profile_id: user.id,
      address_id: input.addressId,
      description: input.description,
      service_type: input.serviceType,
      status: ORDER_STATUS_VALIDATION,
    })
    .select()
    .single();

  if (error || !data) {
    return { data, error };
  }

  console.log("ORDER CREATED:", data);

  const { data: address, error: addressError } = await getAddressById(
    input.addressId,
  );

  console.log("ADDRESS FOUND:", address);
  console.log("ADDRESS ERROR:", addressError);

  const quoteResult = await generateAutomaticQuote({
    orderId: data.id,
    description: data.description,
    serviceType: data.service_type,
    locationText: `${address?.address_line ?? ""} ${address?.reference ?? ""} ${address?.label ?? ""}`,
  });

  console.log("AUTOMATIC QUOTE RESULT:", quoteResult);

  if (quoteResult.error) {
    console.error("Quote generation failed", quoteResult.error);
  }

  return { data, error: null };
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
    .order("created_at", { ascending: false });

  return { data, error };
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

  return { data, error };
}
