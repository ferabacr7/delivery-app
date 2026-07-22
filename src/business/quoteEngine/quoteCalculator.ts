import { QuoteCalculationResult } from "./models";

export type QuoteCalculatorInput = {
  serviceFee: number;
  deliveryFee: number;
  commission?: number;
  surcharges?: number;
};

export class QuoteCalculator {
  calculate({
    serviceFee,
    deliveryFee,
    commission = 0,
    surcharges = 0,
  }: QuoteCalculatorInput): QuoteCalculationResult {
    this.validateAmount(
      serviceFee,
      "La tarifa del servicio no es válida.",
    );

    this.validateAmount(
      deliveryFee,
      "La tarifa de entrega no es válida.",
    );

    this.validateAmount(
      commission,
      "La comisión no es válida.",
    );

    this.validateAmount(
      surcharges,
      "Los recargos no son válidos.",
    );

    const subtotal =
      serviceFee +
      commission +
      surcharges;

    const total =
      subtotal +
      deliveryFee;

    return {
      serviceFee,
      deliveryFee,
      commission,
      surcharges,
      subtotal,
      total,
    };
  }

  private validateAmount(
    amount: number,
    errorMessage: string,
  ): void {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(errorMessage);
    }
  }
}