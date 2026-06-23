import { supabase } from "../lib/supabase";

export async function getOrderQuote(orderId: string) {
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("order_id", orderId)
    .single();

  return { data, error };
}

export async function acceptQuote(quoteId: string) {
  const { data: quote, error: quoteError } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", quoteId)
    .single();

  if (quoteError || !quote) {
    return {
      data: null,
      error: quoteError ?? new Error("Quote not found"),
    };
  }

  const { data: updatedQuote, error: updateQuoteError } = await supabase
    .from("quotes")
    .update({
      status: "accepted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)
    .select()
    .single();

  if (updateQuoteError) {
    console.error("ERROR ACTUALIZANDO QUOTE:", updateQuoteError);

    return {
      data: null,
      error: updateQuoteError,
    };
  }

  console.log("QUOTE ACTUALIZADA:", updatedQuote);

  const { data: updatedOrder, error: updateOrderError } = await supabase
    .from("orders")
    .update({
      status: "accepted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", quote.order_id)
    .select()
    .single();

  if (updateOrderError) {
    console.error("ERROR ACTUALIZANDO ORDER:", updateOrderError);

    return {
      data: null,
      error: updateOrderError,
    };
  }

  console.log("ORDER ACTUALIZADA:", updatedOrder);

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
    .single();

  if (quoteError || !quote) {
    return {
      data: null,
      error: quoteError ?? new Error("Quote not found"),
    };
  }

  const { data: updatedQuote, error: updateQuoteError } = await supabase
    .from("quotes")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", quoteId)
    .select()
    .single();

  if (updateQuoteError) {
    console.error("ERROR RECHAZANDO QUOTE:", updateQuoteError);

    return {
      data: null,
      error: updateQuoteError,
    };
  }

  const { data: updatedOrder, error: updateOrderError } = await supabase
    .from("orders")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", quote.order_id)
    .select()
    .single();

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
