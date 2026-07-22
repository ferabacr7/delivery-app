/**
 * Configuración centralizada de reglas de negocio.
 *
 * Este archivo es la fuente de verdad para:
 * - monedas soportadas
 * - límites de compra
 * - parámetros operativos
 * - comisión
 * - recargos
 *
 * No contiene lógica financiera compleja.
 * Esa responsabilidad pertenece al Quote Engine V2.
 */

export const SUPPORTED_CURRENCIES = [
  "CRC",
  "USD",
] as const;

export type SupportedCurrency =
  (typeof SUPPORTED_CURRENCIES)[number];

export const SERVICE_TYPES = [
  "SUPERMARKET",
  "FOOD_PICKUP",
  "PHARMACY",
  "GENERAL_MESSAGING",
] as const;

export type ServiceType =
  (typeof SERVICE_TYPES)[number];

export const DELIVERY_ZONES = [
  "POTRERO",
  "FLAMINGO",
  "BRASILITO",
] as const;

export type DeliveryZone =
  (typeof DELIVERY_ZONES)[number];

/**
 * Moneda base del negocio.
 *
 * Las tarifas internas se almacenan inicialmente en CRC.
 * Cuando se habilite USD completamente, la conversión deberá
 * realizarse mediante una tasa guardada en Supabase o administrada
 * desde el panel interno.
 */
export const BASE_CURRENCY: SupportedCurrency = "CRC";

export type PurchaseCurrencyConfig = {
  minimum: number;
  maximum: number;
  step: number;
  locale: string;
  currency: SupportedCurrency;
};

/**
 * Configuración principal del negocio.
 */
export const businessConfig = {
  currency: {
    baseCurrency: BASE_CURRENCY,

    supportedCurrencies: SUPPORTED_CURRENCIES,

    /**
     * La tasa de cambio definitiva no se hardcodea aquí.
     */
    exchangeRateSource: "DATABASE" as const,
  },

  purchase: {
    crc: {
      minimum: 5_000,
      maximum: 50_000,
      step: 1_000,
      locale: "es-CR",
      currency: "CRC",
    },

    usd: {
      minimum: 10,
      maximum: 100,
      step: 5,
      locale: "en-US",
      currency: "USD",
    },
  },

  commission: {
    enabled: false,
    type: "PERCENTAGE" as const,
    value: 0,
  },

  surcharges: {
    enabled: false,

    nightService: {
      enabled: false,
      amount: 0,
      currency: BASE_CURRENCY,
    },

    highDemand: {
      enabled: false,
      amount: 0,
      currency: BASE_CURRENCY,
    },

    waitingTime: {
      enabled: false,
      amountPerMinute: 0,
      currency: BASE_CURRENCY,
    },
  },

  operationalLimits: {
    maximumActiveOrdersPerUser: null as number | null,

    maximumDeliveryDistanceKm: null as number | null,
  },

  expiration: {
    quoteExpirationMinutes: null as number | null,

    unpaidOrderExpirationMinutes: null as number | null,
  },
} as const;

/**
 * Comprueba si una moneda está soportada.
 */
export function isSupportedCurrency(
  currency: string,
): currency is SupportedCurrency {
  return SUPPORTED_CURRENCIES.includes(
    currency as SupportedCurrency,
  );
}

/**
 * Devuelve la configuración de compra correspondiente
 * a la moneda indicada.
 */
export function getPurchaseConfig(
  currency: SupportedCurrency,
): PurchaseCurrencyConfig {
  if (currency === "USD") {
    return businessConfig.purchase.usd;
  }

  return businessConfig.purchase.crc;
}

/**
 * Valida un monto usando los límites de su moneda.
 */
export function isValidPurchaseAmount(
  amount: number,
  currency: SupportedCurrency = BASE_CURRENCY,
): boolean {
  const config = getPurchaseConfig(currency);

  return (
    Number.isFinite(amount) &&
    amount >= config.minimum &&
    amount <= config.maximum
  );
}

/**
 * Ajusta un monto para que permanezca dentro del rango
 * permitido para la moneda indicada.
 */
export function clampPurchaseAmount(
  amount: number,
  currency: SupportedCurrency = BASE_CURRENCY,
): number {
  const config = getPurchaseConfig(currency);

  return Math.min(
    Math.max(amount, config.minimum),
    config.maximum,
  );
}

/**
 * Devuelve el monto inicial recomendado para el selector.
 */
export function getDefaultPurchaseAmount(
  currency: SupportedCurrency = BASE_CURRENCY,
): number {
  return getPurchaseConfig(currency).minimum;
}

/**
 * Formatea un monto según su moneda.
 *
 * Este helper solo aplica formato. No convierte valores.
 */
export function formatPurchaseAmount(
  amount: number,
  currency: SupportedCurrency = BASE_CURRENCY,
): string {
  const config = getPurchaseConfig(currency);

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits:
      config.currency === "CRC" ? 0 : 2,
    maximumFractionDigits:
      config.currency === "CRC" ? 0 : 2,
  }).format(amount);
}