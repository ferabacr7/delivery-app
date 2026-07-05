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
    location: ResolvedLocation
  ): GeneratedQuote {
    return {
      orderId: input.orderId,

      serviceType: input.serviceType,
      zone: location.zone,
      estimatedDistanceKm: location.distanceKm,

      subtotal: calculation.subtotal,
      deliveryFee: calculation.deliveryFee,
      total: calculation.total,

      quoteSource: "AUTO",
      calculationVersion: 1,

      customerMessage: null,
      internalNotes: null,
    };
  }
}