import {
  GeneratedQuote,
  QuoteCalculationResult,
  QuoteInput,
  ResolvedLocation,
} from "./models";

export class QuoteGenerator {
  generate(
    input: QuoteInput,
    calculation: QuoteCalculationResult,
    location: ResolvedLocation,
  ): GeneratedQuote {
    return {
      orderId: input.orderId,

      serviceType: input.serviceType,
      zone: location.zone,
      estimatedDistanceKm: location.distanceKm,

      serviceFee: calculation.serviceFee,
      deliveryFee: calculation.deliveryFee,
      commission: calculation.commission,
      surcharges: calculation.surcharges,
      subtotal: calculation.subtotal,
      total: calculation.total,

      currency: input.currency,

      quoteSource: "AUTO",
      calculationVersion: 2,

      customerMessage: null,
      internalNotes: null,
    };
  }
}