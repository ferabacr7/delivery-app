import { QuoteCalculationResult } from "./models";

export type QuoteCalculatorInput = {
  serviceFee: number;
  deliveryFee: number;
};

export class QuoteCalculator {
  calculate({
    serviceFee,
    deliveryFee,
  }: QuoteCalculatorInput): QuoteCalculationResult {
    if (!Number.isFinite(serviceFee) || serviceFee < 0) {
      throw new Error(
        "La tarifa del servicio no es válida.",
      );
    }

    if (
      !Number.isFinite(deliveryFee) ||
      deliveryFee < 0
    ) {
      throw new Error(
        "La tarifa de entrega no es válida.",
      );
    }

    const subtotal = serviceFee;
    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      total,
    };
  }
}