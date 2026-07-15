export type QuoteStatusType =
  | "pending"
  | "accepted"
  | "rejected"
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

  location: {
    title: string;
    address: string;
    reference?: string | null;

    latitude?: number | null;
    longitude?: number | null;

    googleMapsUrl?: string;
    wazeUrl?: string;
  };

  pricing: {
    title: string;
    subtotalLabel: string;
    subtotal: string;
    deliveryFeeLabel: string;
    deliveryFee: string;
    totalLabel: string;
    total: string;
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
