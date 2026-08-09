import { QuoteInput } from "@/business/quoteEngine/models";
import { QuoteOrchestrator } from "@/business/quoteEngine/quoteOrchestrator";
import { supabase } from "@/lib/supabase";

export async function generateAutomaticQuote(input: QuoteInput) {
  try {
    const orchestrator = new QuoteOrchestrator();

    /**
     * Cotización en la moneda seleccionada por el cliente.
     *
     * ES → CRC
     * EN → USD
     */
    const quote = await orchestrator.generateQuote(input);

    /**
     * Conservamos siempre los valores oficiales/base en CRC.
     *
     * Esto evita intentar reconstruir CRC desde montos USD
     * que ya fueron redondeados.
     *
     * Ejemplo:
     *
     * Base:
     * ₡2.000 + ₡2.000 = ₡4.000
     *
     * USD:
     * $4 + $4 = $8
     *
     * Si después volvemos a español debemos recuperar
     * ₡4.000, no calcular $8 × 505 = ₡4.040.
     */
    const crcQuote =
      input.currency === "CRC"
        ? quote
        : await orchestrator.generateQuote({
            ...input,
            currency: "CRC",
          });

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        order_id: quote.orderId,

        service_type: quote.serviceType,
        zone: quote.zone,
        estimated_distance_km: quote.estimatedDistanceKm,

        /**
         * Valores en la moneda en la que nació
         * la cotización.
         */
        service_fee: quote.serviceFee,
        delivery_fee: quote.deliveryFee,
        commission: quote.commission,
        surcharges: quote.surcharges,
        subtotal: quote.subtotal,
        total: quote.total,

        /**
         * Valores base oficiales en CRC.
         *
         * Estos permanecen estables aunque el cliente
         * cambie el idioma de la aplicación.
         */
        service_fee_crc: crcQuote.serviceFee,
        delivery_fee_crc: crcQuote.deliveryFee,
        subtotal_crc: crcQuote.subtotal,
        total_crc: crcQuote.total,

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

    console.log("QUOTE STORED WITH CRC BASE:", {
      currency: quote.currency,

      serviceFee: quote.serviceFee,
      deliveryFee: quote.deliveryFee,
      subtotal: quote.subtotal,
      total: quote.total,

      serviceFeeCrc: crcQuote.serviceFee,
      deliveryFeeCrc: crcQuote.deliveryFee,
      subtotalCrc: crcQuote.subtotal,
      totalCrc: crcQuote.total,
    });

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