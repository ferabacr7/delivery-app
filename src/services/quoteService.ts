import { supabase } from "../lib/supabase";

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
}: {
  orderId: string;
  subtotal: number;
  deliveryFee: number;
  notes?: string;
}) {
  const total = subtotal + deliveryFee;

  const { data: createdQuote, error: quoteError } = await supabase
    .from("quotes")
    .insert({
      order_id: orderId,
      amount: total,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      notes: notes ?? "",
      status: "PENDING",
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
      status: "QUOTED",
      updated_at: new Date().toISOString(),
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

export async function acceptQuote(quoteId: string) {
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

  const { data: updatedQuote, error: updateQuoteError } = await supabase
    .from("quotes")
    .update({
      status: "ACCEPTED",
      updated_at: new Date().toISOString(),
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
      status: "ACCEPTED",
      updated_at: new Date().toISOString(),
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

  return {
    data: {
      quote: updatedQuote,
      order: updatedOrder,
    },
    error: null,
  };
}

export async function rejectQuote(quoteId: string) {
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

  const { data: updatedQuote, error: updateQuoteError } = await supabase
    .from("quotes")
    .update({
      status: "REJECTED",
      updated_at: new Date().toISOString(),
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
      status: "REJECTED",
      updated_at: new Date().toISOString(),
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

  return {
    data: {
      quote: updatedQuote,
      order: updatedOrder,
    },
    error: null,
  };
}
