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
  PickupZone,
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

    /**
     * Determina la zona real de entrega
     * utilizando las coordenadas de la
     * dirección seleccionada.
     */
    const location =
      this.locationResolver.resolve({
        latitude: input.latitude,
        longitude: input.longitude,
      });

    const pricingServiceType =
      this.resolvePricingServiceType(
        input.serviceType,
      );

    /**
     * Zona seleccionada manualmente:
     *
     * Supermercado/Farmacia:
     * Zona de preferencia
     *
     * Restaurante/Mensajería:
     * Zona de retiro
     */
    const pickupZone =
      this.resolvePickupZone(
        input.pickupZone,
      );

    /**
     * Zona real de la dirección
     * de entrega.
     */
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

    const { data, error } =
      await calculateAutomaticQuote({
        serviceType:
          pricingServiceType,
        pickupZone,
        deliveryZone,
        courierSize,
        currency: input.currency,
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
        serviceFee:
          data.breakdown.serviceFee,

        deliveryFee:
          data.breakdown.deliveryFee,

        commission:
          data.breakdown.commission,

        surcharges:
          data.breakdown.surcharges,
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

  private resolvePickupZone(
    pickupZone: PickupZone,
  ): DeliveryZone {
    switch (pickupZone) {
      case "POTRERO":
        return DELIVERY_ZONE.POTRERO;

      case "FLAMINGO":
        return DELIVERY_ZONE.FLAMINGO;

      case "BRASILITO":
        return DELIVERY_ZONE.BRASILITO;

      case "LAS_CATALINAS":
        return DELIVERY_ZONE.LAS_CATALINAS;

      default: {
        const exhaustiveCheck: never =
          pickupZone;

        throw new Error(
          `Zona de retiro no soportada: ${exhaustiveCheck}`,
        );
      }
    }
  }

  private resolveDeliveryZone(
    zone: LocationZone,
  ): DeliveryZone {
    switch (zone) {
      case "POTRERO":
        return DELIVERY_ZONE.POTRERO;

      case "FLAMINGO":
        return DELIVERY_ZONE.FLAMINGO;

      case "BRASILITO":
        return DELIVERY_ZONE.BRASILITO;

      case "LAS_CATALINAS":
        return DELIVERY_ZONE.LAS_CATALINAS;

      default: {
        const exhaustiveCheck: never =
          zone;

        throw new Error(
          `Zona de entrega no soportada: ${exhaustiveCheck}`,
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
}