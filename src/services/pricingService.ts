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

export type SupportedCurrency = "CRC" | "USD";

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

export type ExchangeRate = {
  id: string;
  currency_from: "USD";
  currency_to: "CRC";
  crc_per_usd: number;
  effective_date: string;
  source: string;
  created_at: string;
  updated_at: string;
};

export type CalculateQuoteInput = {
  serviceType: ServiceType;
  deliveryZone: DeliveryZone;
  courierSize?: CourierSize | null;
  currency: SupportedCurrency;
};

export type QuoteBreakdown = {
  serviceFee: number;
  deliveryFee: number;
  commission: number;
  surcharges: number;
  total: number;
};

export type QuoteCalculation = {
  serviceType: ServiceType;
  deliveryZone: DeliveryZone;
  courierSize: CourierSize | null;

  serviceName: string;
  deliveryZoneName: string;

  currency: SupportedCurrency;

  exchangeRate: number | null;

  breakdown: QuoteBreakdown;
};

function validateRequiredValue(
  value: string | null | undefined,
  fieldName: string,
) {
  if (!value?.trim()) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
}

/**
 * Redondea hacia arriba al siguiente múltiplo de $0.50.
 *
 * Ejemplos:
 * 6.12 → 6.50
 * 6.50 → 6.50
 * 6.86 → 7.00
 */
function roundUsdAmount(amount: number) {
  return Math.ceil(amount * 2) / 2;
}

function convertCrcToUsd(
  amountInCrc: number,
  crcPerUsd: number,
) {
  if (
    !Number.isFinite(crcPerUsd) ||
    crcPerUsd <= 0
  ) {
    throw new Error(
      "El tipo de cambio configurado no es válido.",
    );
  }

  return roundUsdAmount(
    amountInCrc / crcPerUsd,
  );
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

/**
 * Obtiene el tipo de cambio más reciente disponible.
 *
 * No exige que exista uno para hoy:
 * si todavía no fue actualizado, utiliza el último guardado.
 */
export async function getLatestExchangeRate() {
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("*")
    .eq("currency_from", "USD")
    .eq("currency_to", "CRC")
    .order("effective_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

    console.warn("EXCHANGE RATE RESULT:", {
  data,
  error,
});

  return {
    data: data as ExchangeRate | null,
    error,
  };
}

export async function calculateAutomaticQuote({
  serviceType,
  deliveryZone,
  courierSize = null,
  currency,
}: CalculateQuoteInput): Promise<{
  data: QuoteCalculation | null;
  error: Error | null;
}> {
  try {
    validateRequiredValue(
      serviceType,
      "serviceType",
    );

    validateRequiredValue(
      deliveryZone,
      "deliveryZone",
    );

    validateRequiredValue(
      currency,
      "currency",
    );

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
      exchangeRateResult,
    ] = await Promise.all([
      getPricingRule(
        serviceCategory,
        serviceRuleKey,
      ),

      getPricingRule(
        PRICING_CATEGORY.DELIVERY_ZONE,
        deliveryZone,
      ),

      currency === "USD"
        ? getLatestExchangeRate()
        : Promise.resolve({
            data: null,
            error: null,
          }),
    ]);

    if (serviceResult.error) {
      throw serviceResult.error;
    }

    if (deliveryZoneResult.error) {
      throw deliveryZoneResult.error;
    }

    if (exchangeRateResult.error) {
      throw exchangeRateResult.error;
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

    if (
      currency === "USD" &&
      !exchangeRateResult.data
    ) {
      throw new Error(
        "No existe un tipo de cambio configurado para generar cotizaciones en dólares.",
      );
    }

    const baseServiceFeeCrc = Number(
      serviceResult.data.amount,
    );

    const baseDeliveryFeeCrc = Number(
      deliveryZoneResult.data.amount,
    );

    if (
      !Number.isFinite(baseServiceFeeCrc) ||
      !Number.isFinite(baseDeliveryFeeCrc)
    ) {
      throw new Error(
        "Uno de los precios configurados no es válido.",
      );
    }

    const exchangeRate =
      currency === "USD"
        ? Number(
            exchangeRateResult.data
              ?.crc_per_usd,
          )
        : null;

    const serviceFee =
      currency === "USD"
        ? convertCrcToUsd(
            baseServiceFeeCrc,
            exchangeRate!,
          )
        : baseServiceFeeCrc;

    const deliveryFee =
      currency === "USD"
        ? convertCrcToUsd(
            baseDeliveryFeeCrc,
            exchangeRate!,
          )
        : baseDeliveryFeeCrc;

    const commission = 0;
    const surcharges = 0;

    const total =
      serviceFee +
      deliveryFee +
      commission +
      surcharges;

    console.warn(
      "PRICING CURRENCY CONVERSION:",
      {
        currency,

        baseServiceFeeCrc,
        baseDeliveryFeeCrc,

        exchangeRate,

        serviceFee,
        deliveryFee,
        total,
      },
    );

    return {
      data: {
        serviceType,
        deliveryZone,

        courierSize:
          serviceType ===
          SERVICE_TYPE.COURIER
            ? courierSize
            : null,

        serviceName:
          serviceResult.data.name,

        deliveryZoneName:
          deliveryZoneResult.data.name,

        currency,

        exchangeRate,

        breakdown: {
          serviceFee,
          deliveryFee,
          commission,
          surcharges,
          total,
        },
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