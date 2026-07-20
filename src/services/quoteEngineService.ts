import { supabase } from "@/lib/supabase";
import { QuoteOrchestrator } from "@/business/quoteEngine/quoteOrchestrator";
import { QuoteInput } from "@/business/quoteEngine/models";

export async function generateAutomaticQuote(input: QuoteInput) {
  try {
    const orchestrator = new QuoteOrchestrator();

    const quote = await orchestrator.generateQuote(input);
    const { data, error } = await supabase
      .from("quotes")
      .insert({
        order_id: quote.orderId,

        service_type: quote.serviceType,
        zone: quote.zone,
        estimated_distance_km: quote.estimatedDistanceKm,

        subtotal: quote.subtotal,
        delivery_fee: quote.deliveryFee,
        total: quote.total,

        quote_source: quote.quoteSource,
        calculation_version: quote.calculationVersion,

        customer_message: quote.customerMessage,
        internal_notes: quote.internalNotes,

        status: "PENDING",
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error("Automatic quote generation failed:", error);

    return {
      data: null,
      error,
    };
  }
}
