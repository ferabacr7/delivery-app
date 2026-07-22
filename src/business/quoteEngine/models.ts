export type QuoteSource = "AUTO" | "MANUAL";

export type ServiceType =
  | "SUPERMARKET"
  | "PHARMACY"
  | "FOOD_PICKUP"
  | "GENERAL_MESSAGING";

export type CourierWeight = "LIGHT" | "MEDIUM" | "HEAVY";

export type LocationZone = "LOCAL" | "NEARBY" | "EXTENDED";

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

  // Se conserva para mostrar o registrar la dirección,
  // pero ya no se utilizará para calcular la zona.
  locationText?: string | null;

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
