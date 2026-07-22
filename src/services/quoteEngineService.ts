import { QuoteInput } from "@/business/quoteEngine/models";
import { QuoteOrchestrator } from "@/business/quoteEngine/quoteOrchestrator";
import { supabase } from "@/lib/supabase";

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

        service_fee: quote.serviceFee,
        delivery_fee: quote.deliveryFee,
        commission: quote.commission,
        surcharges: quote.surcharges,
        subtotal: quote.subtotal,
        total: quote.total,

        currency: quote.currency,

        quote_source: quote.quoteSource,
        calculation_version: quote.calculationVersion,

        customer_message: quote.customerMessage,
        internal_notes: quote.internalNotes,

        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Automatic quote insert failed:",
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
  } catch (error) {
    console.error(
      "Automatic quote generation failed:",
      error,
    );

    return {
      data: null,
      error,
    };
  }
}