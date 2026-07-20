import {
  calculateAutomaticQuote,
  COURIER_SIZE,
  CourierSize,
  DELIVERY_ZONE,
  DeliveryZone,
  SERVICE_TYPE,
  ServiceType as PricingServiceType,
} from "../../services/pricingService";

import { LocationResolver } from "./locationResolver";
import {
  CourierWeight,
  GeneratedQuote,
  LocationZone,
  QuoteInput,
  ServiceType,
} from "./models";
import { QuoteCalculator } from "./quoteCalculator";
import { QuoteGenerator } from "./quoteGenerator";
import { Validator } from "./validator";

export class QuoteOrchestrator {
  constructor(
    private readonly validator = new Validator(),
    private readonly locationResolver =
      new LocationResolver(),
    private readonly quoteCalculator =
      new QuoteCalculator(),
    private readonly quoteGenerator =
      new QuoteGenerator(),
  ) {}

  async generateQuote(
    input: QuoteInput,
  ): Promise<GeneratedQuote> {
    const validation =
      this.validator.validate(input);

    if (!validation.isValid) {
      throw new Error(
        validation.errors.join(" "),
      );
    }

    const location =
      this.locationResolver.resolve(
        input.locationText,
      );

    const pricingServiceType =
      this.resolvePricingServiceType(
        input.serviceType,
      );

    const deliveryZone =
      this.resolveDeliveryZone(
        location.zone,
      );

    const courierSize =
      input.serviceType ===
      "GENERAL_MESSAGING"
        ? this.resolveCourierSize(
            input.courierWeight,
          )
        : null;

    console.log(
      "QUOTE ENGINE COURIER WEIGHT:",
      input.courierWeight,
    );

    console.log(
      "QUOTE ENGINE COURIER SIZE:",
      courierSize,
    );

    const { data, error } =
      await calculateAutomaticQuote({
        serviceType: pricingServiceType,
        deliveryZone,
        courierSize,
      });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(
        "No se pudo calcular la cotización automática.",
      );
    }

    const calculation =
      this.quoteCalculator.calculate({
        serviceFee: data.serviceFee,
        deliveryFee: data.distanceFee,
      });

    return this.quoteGenerator.generate(
      input,
      calculation,
      location,
    );
  }

  private resolvePricingServiceType(
    serviceType: ServiceType,
  ): PricingServiceType {
    switch (serviceType) {
      case "SUPERMARKET":
        return SERVICE_TYPE.SUPERMARKET;

      case "PHARMACY":
        return SERVICE_TYPE.PHARMACY;

      case "FOOD_PICKUP":
        return SERVICE_TYPE.RESTAURANT;

      case "GENERAL_MESSAGING":
        return SERVICE_TYPE.COURIER;

      default: {
        const exhaustiveCheck: never =
          serviceType;

        throw new Error(
          `Servicio no soportado: ${exhaustiveCheck}`,
        );
      }
    }
  }

  private resolveCourierSize(
    courierWeight:
      | CourierWeight
      | null
      | undefined,
  ): CourierSize {
    switch (courierWeight) {
      case "LIGHT":
        return COURIER_SIZE.LIGHT;

      case "MEDIUM":
        return COURIER_SIZE.MEDIUM;

      case "HEAVY":
        return COURIER_SIZE.HEAVY;

      default:
        throw new Error(
          "Debe seleccionar el peso aproximado de la mensajería.",
        );
    }
  }

  private resolveDeliveryZone(
    zone: LocationZone,
  ): DeliveryZone {
    switch (zone) {
      case "LOCAL":
        return DELIVERY_ZONE.POTRERO;

      case "NEARBY":
        return DELIVERY_ZONE.FLAMINGO;

      case "EXTENDED":
        return DELIVERY_ZONE.BRASILITO;

      default: {
        const exhaustiveCheck: never =
          zone;

        throw new Error(
          `Zona no soportada: ${exhaustiveCheck}`,
        );
      }
    }
  }
}