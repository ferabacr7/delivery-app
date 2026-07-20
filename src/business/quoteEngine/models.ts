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

export type LocationZone =
  | "LOCAL"
  | "NEARBY"
  | "EXTENDED";

export type QuoteValidationResult = {
  isValid: boolean;
  errors: string[];
};

export type QuoteInput = {
  orderId: string;
  description: string;
  serviceType: ServiceType;
  locationText?: string | null;
  courierWeight?: CourierWeight | null;
};

export type ResolvedLocation = {
  zone: LocationZone;
  distanceKm: number;
};

export type QuoteCalculationResult = {
  subtotal: number;
  deliveryFee: number;
  total: number;
};

export type GeneratedQuote = {
  orderId: string;

  serviceType: ServiceType;
  zone: LocationZone;
  estimatedDistanceKm: number;

  subtotal: number;
  deliveryFee: number;
  total: number;

  quoteSource: QuoteSource;
  calculationVersion: number;

  customerMessage?: string | null;
  internalNotes?: string | null;
};