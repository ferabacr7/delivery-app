export type QuoteSource = "AUTO" | "MANUAL";

export type ServiceType =
  | "SUPERMARKET"
  | "PHARMACY"
  | "FOOD_PICKUP"
  | "GENERAL_MESSAGING";

export type CourierWeight =
  | "LIGHT"
  | "MEDIUM"
  | "HEAVY";

/**
 * Zonas reales de operación de Boomerang.
 *
 * Se utilizan tanto para:
 * - zona de preferencia / retiro
 * - zona de entrega
 * - cálculo de la matriz de tarifas
 */
export type LocationZone =
  | "POTRERO"
  | "FLAMINGO"
  | "BRASILITO"
  | "LAS_CATALINAS";

export type PickupZone = LocationZone;

export type QuoteValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type QuoteInput = {
  orderId: string;
  description: string;
  serviceType: ServiceType;

  currency: "CRC" | "USD";

  latitude?: number | null;
  longitude?: number | null;

  /**
   * Dirección de entrega mostrada al usuario.
   */
  locationText?: string | null;

  /**
   * Zona de preferencia / zona de retiro
   * seleccionada manualmente por el cliente.
   */
  pickupZone: PickupZone;

  courierWeight?: CourierWeight | null;
};

export type ResolvedLocation = {
  zone: LocationZone;
  distanceKm: number;
};

export type QuoteCalculationResult = {
  serviceFee: number;
  deliveryFee: number;
  commission: number;
  surcharges: number;
  subtotal: number;
  total: number;
};

export type GeneratedQuote = {
  orderId: string;

  serviceType: ServiceType;

  /**
   * Zona donde se retira el producto,
   * comida, medicamento o paquete.
   */
  pickupZone: PickupZone;

  /**
   * Zona correspondiente a la dirección
   * de entrega del cliente.
   */
  zone: LocationZone;

  estimatedDistanceKm: number;

  serviceFee: number;
  deliveryFee: number;
  commission: number;
  surcharges: number;
  subtotal: number;
  total: number;

  currency: "CRC" | "USD";

  quoteSource: QuoteSource;
  calculationVersion: number;

  customerMessage?: string | null;
  internalNotes?: string | null;
};