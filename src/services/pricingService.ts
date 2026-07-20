import { supabase } from "../lib/supabase";

export const PRICING_CATEGORY = {
  DELIVERY_ZONE: "delivery_zone",
  SERVICE: "service",
  COURIER: "courier",
} as const;

export const DELIVERY_ZONE = {
  POTRERO: "potrero",
  FLAMINGO: "flamingo",
  BRASILITO: "brasilito",
} as const;

export const SERVICE_TYPE = {
  SUPERMARKET: "supermarket",
  RESTAURANT: "restaurant",
  PHARMACY: "pharmacy",
  COURIER: "courier",
} as const;

export const COURIER_SIZE = {
  LIGHT: "light",
  MEDIUM: "medium",
  HEAVY: "heavy",
} as const;

export type PricingCategory =
  (typeof PRICING_CATEGORY)[keyof typeof PRICING_CATEGORY];

export type DeliveryZone =
  (typeof DELIVERY_ZONE)[keyof typeof DELIVERY_ZONE];

export type ServiceType =
  (typeof SERVICE_TYPE)[keyof typeof SERVICE_TYPE];

export type CourierSize =
  (typeof COURIER_SIZE)[keyof typeof COURIER_SIZE];

export type PricingRule = {
  id: string;
  category: PricingCategory;
  rule_key: string;
  name: string;
  amount: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type CalculateQuoteInput = {
  serviceType: ServiceType;
  deliveryZone: DeliveryZone;
  courierSize?: CourierSize | null;
};

export type QuoteCalculation = {
  serviceType: ServiceType;
  deliveryZone: DeliveryZone;
  courierSize: CourierSize | null;

  serviceName: string;
  deliveryZoneName: string;

  serviceFee: number;
  distanceFee: number;
  totalServiceFee: number;
};

function validateRequiredValue(
  value: string | null | undefined,
  fieldName: string,
) {
  if (!value?.trim()) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
}

export async function getActivePricingRules() {
  const { data, error } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("name");

  return {
    data: (data ?? []) as PricingRule[],
    error,
  };
}

export async function getPricingRule(
  category: PricingCategory,
  ruleKey: string,
) {
  validateRequiredValue(category, "category");
  validateRequiredValue(ruleKey, "ruleKey");

  const { data, error } = await supabase
    .from("pricing_rules")
    .select("*")
    .eq("category", category)
    .eq("rule_key", ruleKey)
    .eq("active", true)
    .maybeSingle();

  return {
    data: data as PricingRule | null,
    error,
  };
}

export async function calculateAutomaticQuote({
  serviceType,
  deliveryZone,
  courierSize = null,
}: CalculateQuoteInput): Promise<{
  data: QuoteCalculation | null;
  error: Error | null;
}> {
  try {
    validateRequiredValue(serviceType, "serviceType");
    validateRequiredValue(deliveryZone, "deliveryZone");

    const serviceRuleKey =
      serviceType === SERVICE_TYPE.COURIER
        ? courierSize
        : serviceType;

    if (
      serviceType === SERVICE_TYPE.COURIER &&
      !courierSize
    ) {
      throw new Error(
        "Debe seleccionar el tamaño o peso de la mensajería.",
      );
    }

    if (!serviceRuleKey) {
      throw new Error(
        "No se pudo determinar la tarifa del servicio.",
      );
    }

    const serviceCategory =
      serviceType === SERVICE_TYPE.COURIER
        ? PRICING_CATEGORY.COURIER
        : PRICING_CATEGORY.SERVICE;

    const [
      serviceResult,
      deliveryZoneResult,
    ] = await Promise.all([
      getPricingRule(
        serviceCategory,
        serviceRuleKey,
      ),
      getPricingRule(
        PRICING_CATEGORY.DELIVERY_ZONE,
        deliveryZone,
      ),
    ]);

    if (serviceResult.error) {
      throw serviceResult.error;
    }

    if (deliveryZoneResult.error) {
      throw deliveryZoneResult.error;
    }

    if (!serviceResult.data) {
      throw new Error(
        "No se encontró una tarifa activa para el servicio seleccionado.",
      );
    }

    if (!deliveryZoneResult.data) {
      throw new Error(
        "No se encontró una tarifa activa para la zona seleccionada.",
      );
    }

    const serviceFee = Number(
      serviceResult.data.amount,
    );

    const distanceFee = Number(
      deliveryZoneResult.data.amount,
    );

    if (
      !Number.isFinite(serviceFee) ||
      !Number.isFinite(distanceFee)
    ) {
      throw new Error(
        "Uno de los precios configurados no es válido.",
      );
    }

    const totalServiceFee =
      serviceFee + distanceFee;

    return {
      data: {
        serviceType,
        deliveryZone,
        courierSize:
          serviceType === SERVICE_TYPE.COURIER
            ? courierSize
            : null,

        serviceName:
          serviceResult.data.name,

        deliveryZoneName:
          deliveryZoneResult.data.name,

        serviceFee,
        distanceFee,
        totalServiceFee,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error
          : new Error(
              "No se pudo calcular la cotización.",
            ),
    };
  }
}