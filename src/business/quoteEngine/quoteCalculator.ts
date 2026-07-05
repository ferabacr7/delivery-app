import {
  QuoteCalculationResult,
  ResolvedLocation,
  ServiceType,
} from "./models";

export class QuoteCalculator {
  calculate(
    serviceType: ServiceType,
    location: ResolvedLocation
  ): QuoteCalculationResult {
    const baseFee = this.getBaseFeeByService(serviceType);
    const deliveryFee = this.getDeliveryFeeByZone(location.zone);

    const subtotal = baseFee;
    const total = subtotal + deliveryFee;

    return {
      subtotal,
      deliveryFee,
      total,
    };
  }

  private getBaseFeeByService(serviceType: ServiceType): number {
    switch (serviceType) {
      case "SUPERMARKET":
        return 1500;

      case "PHARMACY":
        return 1200;

      case "FOOD_PICKUP":
        return 1000;

      case "GENERAL_MESSAGING":
        return 1300;

      default:
        return 1500;
    }
  }

  private getDeliveryFeeByZone(zone: ResolvedLocation["zone"]): number {
    switch (zone) {
      case "LOCAL":
        return 1000;

      case "NEARBY":
        return 2000;

      case "EXTENDED":
        return 3500;

      default:
        return 3500;
    }
  }
}