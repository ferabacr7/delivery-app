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
  LAS_CATALINAS: "las_catalinas",
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
  crc_per_usd: number | string;
  effective_date: string;
  source: string | null;
  created_at: string;
  updated_at: string;
};

export type CalculateQuoteInput = {
  serviceType: ServiceType;

  /**
   * Zona donde Boomerang debe retirar el producto,
   * comida, medicamento o paquete.
   */
  pickupZone: DeliveryZone;

  /**
   * Zona donde se encuentra la dirección
   * de entrega seleccionada por el cliente.
   */
  deliveryZone: DeliveryZone;

  courierSize?: CourierSize | null;

  currency: SupportedCurrency;
};

export type PricingAdjustmentType =
  | "commission"
  | "surcharge"
  | "discount"
  | "promotion"
  | "tax"
  | "other";

export type PricingAdjustment = {
  id: string;
  type: PricingAdjustmentType;
  label: string;
  amount: number;
};

export type QuoteBreakdown = {
  serviceFee: number;
  deliveryFee: number;

  /**
   * Se mantienen por compatibilidad con las pantallas
   * y cotizaciones actuales.
   */
  commission: number;
  surcharges: number;

  /**
   * Ajustes dinámicos futuros:
   * descuentos, promociones, recargos, impuestos, etc.
   */
  adjustments: PricingAdjustment[];

  adjustmentsTotal: number;
  total: number;
};

export type QuoteCalculation = {
  serviceType: ServiceType;

  pickupZone: DeliveryZone;
  deliveryZone: DeliveryZone;

  courierSize: CourierSize | null;

  serviceName: string;

  /**
   * Nombre de la ruta configurada en pricing_rules.
   * Ejemplo: "Potrero ↔ Flamingo".
   */
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
 * Mantiene un orden único de zonas para poder utilizar
 * una sola regla para ambos sentidos.
 *
 * Ejemplo:
 *
 * Potrero → Flamingo
 * Flamingo → Potrero
 *
 * Ambos utilizan:
 *
 * potrero_flamingo
 */
const DELIVERY_ZONE_ORDER: DeliveryZone[] = [
  DELIVERY_ZONE.POTRERO,
  DELIVERY_ZONE.FLAMINGO,
  DELIVERY_ZONE.BRASILITO,
  DELIVERY_ZONE.LAS_CATALINAS,
];

export function getDeliveryRouteRuleKey(
  pickupZone: DeliveryZone,
  deliveryZone: DeliveryZone,
) {
  const pickupIndex = DELIVERY_ZONE_ORDER.indexOf(pickupZone);
  const deliveryIndex = DELIVERY_ZONE_ORDER.indexOf(deliveryZone);

  if (pickupIndex === -1 || deliveryIndex === -1) {
    throw new Error(
      "No se pudo determinar la ruta entre las zonas seleccionadas.",
    );
  }

  if (pickupIndex <= deliveryIndex) {
    return `${pickupZone}_${deliveryZone}`;
  }

  return `${deliveryZone}_${pickupZone}`;
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
  if (!Number.isFinite(crcPerUsd) || crcPerUsd <= 0) {
    throw new Error(
      "El tipo de cambio configurado no es válido.",
    );
  }

  return roundUsdAmount(amountInCrc / crcPerUsd);
}

function sumPricingAdjustments(
  adjustments: PricingAdjustment[],
) {
  return adjustments.reduce(
    (total, adjustment) => total + adjustment.amount,
    0,
  );
}

function validatePricingAdjustments(
  adjustments: PricingAdjustment[],
) {
  for (const adjustment of adjustments) {
    if (!adjustment.id.trim()) {
      throw new Error(
        "Todos los ajustes deben tener un identificador.",
      );
    }

    if (!adjustment.label.trim()) {
      throw new Error(
        "Todos los ajustes deben tener una descripción.",
      );
    }

    if (!Number.isFinite(adjustment.amount)) {
      throw new Error(
        `El ajuste "${adjustment.label}" tiene un monto inválido.`,
      );
    }
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

/**
 * Obtiene el tipo de cambio más reciente disponible.
 *
 * No exige que exista una tasa para el día actual:
 * si todavía no fue actualizada, utiliza la última guardada.
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
  pickupZone,
  deliveryZone,
  courierSize = null,
  currency,
}: CalculateQuoteInput): Promise<{
  data: QuoteCalculation | null;
  error: Error | null;
}> {
  try {
    validateRequiredValue(serviceType, "serviceType");
    validateRequiredValue(pickupZone, "pickupZone");
    validateRequiredValue(deliveryZone, "deliveryZone");
    validateRequiredValue(currency, "currency");

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

    /**
     * Convierte pickupZone + deliveryZone en la llave
     * única almacenada en pricing_rules.
     *
     * Ejemplo:
     *
     * las_catalinas + brasilito
     * ↓
     * brasilito_las_catalinas
     */
    const deliveryRouteRuleKey =
      getDeliveryRouteRuleKey(
        pickupZone,
        deliveryZone,
      );

    const [
      serviceResult,
      deliveryRouteResult,
      exchangeRateResult,
    ] = await Promise.all([
      getPricingRule(
        serviceCategory,
        serviceRuleKey,
      ),

      getPricingRule(
        PRICING_CATEGORY.DELIVERY_ZONE,
        deliveryRouteRuleKey,
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

    if (deliveryRouteResult.error) {
      throw deliveryRouteResult.error;
    }

    if (exchangeRateResult.error) {
      throw exchangeRateResult.error;
    }

    if (!serviceResult.data) {
      throw new Error(
        "No se encontró una tarifa activa para el servicio seleccionado.",
      );
    }

    if (!deliveryRouteResult.data) {
      throw new Error(
        "No se encontró una tarifa activa para la ruta seleccionada.",
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

    const baseServiceFeeCrc =
      Number(serviceResult.data.amount);

    const baseDeliveryFeeCrc =
      Number(deliveryRouteResult.data.amount);

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
            exchangeRateResult.data?.crc_per_usd,
          )
        : null;

    if (
      currency === "USD" &&
      (!Number.isFinite(exchangeRate) ||
        exchangeRate === null ||
        exchangeRate <= 0)
    ) {
      throw new Error(
        "El tipo de cambio configurado no es válido.",
      );
    }

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

    /**
     * Aquí se agregarán en el futuro:
     *
     * - recargo nocturno
     * - recargo por lluvia
     * - promociones
     * - descuentos
     * - cupones
     * - impuestos
     */
    const adjustments: PricingAdjustment[] = [];

    validatePricingAdjustments(adjustments);

    const adjustmentsTotal =
      sumPricingAdjustments(adjustments);

    const total =
      serviceFee +
      deliveryFee +
      commission +
      surcharges +
      adjustmentsTotal;

    console.warn("PRICING CALCULATION:", {
      currency,
      pickupZone,
      deliveryZone,
      deliveryRouteRuleKey,
      baseServiceFeeCrc,
      baseDeliveryFeeCrc,
      exchangeRate,
      serviceFee,
      deliveryFee,
      commission,
      surcharges,
      adjustments,
      adjustmentsTotal,
      total,
    });

    return {
      data: {
        serviceType,

        pickupZone,
        deliveryZone,

        courierSize:
          serviceType === SERVICE_TYPE.COURIER
            ? courierSize
            : null,

        serviceName: serviceResult.data.name,

        deliveryZoneName:
          deliveryRouteResult.data.name,

        currency,

        exchangeRate,

        breakdown: {
          serviceFee,
          deliveryFee,
          commission,
          surcharges,
          adjustments,
          adjustmentsTotal,
          total,
        },
      },

      error: null,
    };
  } catch (error) {
    const normalizedError =
      error instanceof Error
        ? error
        : new Error(
            "No se pudo calcular la cotización.",
          );

    console.error(
      "CALCULATE AUTOMATIC QUOTE ERROR:",
      normalizedError,
    );

    return {
      data: null,
      error: normalizedError,
    };
  }
}