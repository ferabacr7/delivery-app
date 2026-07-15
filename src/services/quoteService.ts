import { supabase } from "../lib/supabase";
import { createDeliveryForOrder } from "./deliveryService";

const QUOTE_STATUS_PENDING = "PENDING";
const QUOTE_STATUS_ACCEPTED = "ACCEPTED";
const QUOTE_STATUS_REJECTED = "REJECTED";

const ORDER_STATUS_QUOTED = "QUOTED";
const ORDER_STATUS_ACCEPTED = "ACCEPTED";
const ORDER_STATUS_REJECTED = "REJECTED";

type CreateQuoteInput = {
  orderId: string;
  subtotal: number;
  deliveryFee: number;
  notes?: string;
};

export async function getOrderQuote(orderId: string) {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data, error };
}

export async function createQuoteForOrder({
  orderId,
  subtotal,
  deliveryFee,
  notes,
}: CreateQuoteInput) {
  const total = subtotal + deliveryFee;
  const now = new Date().toISOString();

  const { data: createdQuote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      order_id: orderId,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      notes: notes ?? "",
      internal_notes: notes ?? null,
      quote_source: "MANUAL",
      calculation_version: 1,
      status: QUOTE_STATUS_PENDING,
    })
    .select()
    .maybeSingle();

  if (quoteError) {
    return {
      data: null,
      error: quoteError,
    };
  }

  const { data: updatedOrder, error: orderError } = await supabase
    .from("orders")
    .update({
      status: ORDER_STATUS_QUOTED,
      updated_at: now,
    })
    .eq("id", orderId)
    .select()
    .maybeSingle();

  if (orderError) {
    return {
      data: null,
      error: orderError,
    };
  }

  return {
    data: {
      quote: createdQuote,
      order: updatedOrder,
    },
    error: null,
  };
}

async function updateQuoteDecision(
  quoteId: string,
  quoteStatus: typeof QUOTE_STATUS_ACCEPTED | typeof QUOTE_STATUS_REJECTED,
  orderStatus: typeof ORDER_STATUS_ACCEPTED | typeof ORDER_STATUS_REJECTED,
) {
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .maybeSingle();

  if (quoteError || !quote) {
    return {
      data: null,
      error: quoteError ?? new Error("Quote not found"),
    };
  }

  const now = new Date().toISOString();

  const { data: updatedQuote, error: updateQuoteError } = await supabase
    .from("quotes")
    .update({
      status: quoteStatus,
      updated_at: now,
    })
    .eq("id", quoteId)
    .select()
    .maybeSingle();

  if (updateQuoteError) {
    return {
      data: null,
      error: updateQuoteError,
    };
  }

  const { data: updatedOrder, error: updateOrderError } = await supabase
    .from("orders")
    .update({
      status: orderStatus,
      updated_at: now,
    })
    .eq("id", quote.order_id)
    .select()
    .maybeSingle();

  if (updateOrderError) {
  return {
    data: null,
    error: updateOrderError,
  };
}

let delivery = null;

if (quoteStatus === QUOTE_STATUS_ACCEPTED) {
  const { data: createdDelivery, error: deliveryError } =
    await createDeliveryForOrder(quote.order_id);

  if (deliveryError) {
    return {
      data: null,
      error: deliveryError,
    };
  }

  delivery = createdDelivery;
}

return {
  data: {
    quote: updatedQuote,
    order: updatedOrder,
    delivery,
  },
  error: null,
};
}

export async function acceptQuote(quoteId: string) {
  return updateQuoteDecision(
    quoteId,
    QUOTE_STATUS_ACCEPTED,
    ORDER_STATUS_ACCEPTED,
  );
}

export async function rejectQuote(quoteId: string) {
  return updateQuoteDecision(
    quoteId,
    QUOTE_STATUS_REJECTED,
    ORDER_STATUS_REJECTED,
  );
}