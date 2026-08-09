export type QuoteStatusType =
  | "validation"
  | "quoted"
  | "pending"
  | "accepted"
  | "in_progress"
  | "on_route"
  | "delivered"
  | "rejected"
  | "cancelled"
  | "expired"
  | "unknown";

export type QuoteStatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export type QuoteViewModel = {
  orderNumber: string;

  header: {
    title: string;
    subtitle: string;
  };

  service: {
    title: string;
    typeLabel: string;
    type: string;
    description: string;
    statusPrefix: string;
    statusLabel: string;
    statusType: QuoteStatusType;
    statusTone: QuoteStatusTone;
  };

  orderDetails: {
    pickupLocation: string | null;
    courierWeight: string | null;
    paymentMethod: "SINPE" | "CASH" | null;
    courierPaymentStatus: string | null;
  };

  location: {
    title: string;
    address: string;
    reference?: string | null;

    latitude?: number | null;
    longitude?: number | null;

    googleMapsUrl?: string;
    wazeUrl?: string;
  };

  tracking: {
    estimatedArrival: string;
    estimatedArrivalLabel: string;
    lastUpdate: string;
    lastUpdateLabel: string;
  };

  /*
   * Contiene únicamente los cargos del servicio.
   *
   * El monto estimado de la compra nunca se incluye
   * dentro de esta sección.
   */
  pricing: {
    title: string;
    subtotalLabel: string;
    subtotal: string;
    deliveryFeeLabel: string;
    deliveryFee: string;
    totalLabel: string;
    total: string;
  };

  /*
   * Información operativa de la compra.
   *
   * estimatedPurchaseAmount sirve únicamente
   * para validar los límites permitidos.
   */
  purchaseValidation: {
    shouldShow: boolean;
    title: string;
    amountLabel: string;
    amount: string | null;
    helperText: string;

    paymentStatusLabel: string;
    paymentStatus: string | null;

    isFoodPickup: boolean;
  };

  customerMessage: {
    title: string;
    message: string;
  };

  actions: {
    acceptLabel: string;
    rejectLabel: string;
    canRespond: boolean;
  };
};