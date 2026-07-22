import { quoteLabels, QuoteLanguage } from "./labels";

import {
  QuoteStatusType,
  QuoteStatusTone,
  QuoteViewModel,
} from "./QuoteViewModel";

type OrderLike = {
  id?: string;
  description?: string | null;
  service_type?: string | null;
  status?: string | null;

  /*
   * Este monto es únicamente una referencia operativa
   * para validar que la compra esté dentro del límite permitido.
   *
   * No forma parte del subtotal, la tarifa de entrega
   * ni el total del servicio.
   */
  estimated_purchase_amount?: number | string | null;

  /*
   * Solo aplica para FOOD_PICKUP.
   *
   * true  = el pedido del restaurante ya fue pagado.
   * false = el repartidor deberá pagarlo al recogerlo.
   * null  = no aplica o no fue especificado.
   */
  food_order_paid?: boolean | null;

  addresses?: {
    address_line?: string | null;
    reference?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
  } | null;
};

type QuoteLike = {
  id?: string;
  subtotal?: number | string | null;
  delivery_fee?: number | string | null;
  total?: number | string | null;
  currency?: "CRC" | "USD" | null;
  notes?: string | null;
  status?: string | null;
};

type BuildQuoteViewModelInput = {
  order: OrderLike;
  quote: QuoteLike | null;
  language?: QuoteLanguage;
};

function normalizeStatus(status?: string | null): QuoteStatusType {
  const value = status?.trim().toUpperCase();

  switch (value) {
    case "PENDING":
      return "pending";

    case "ACCEPTED":
      return "accepted";

    case "REJECTED":
      return "rejected";

    case "EXPIRED":
      return "expired";

    default:
      return "unknown";
  }
}

function normalizeServiceType(serviceType?: string | null) {
  if (!serviceType) {
    return "UNKNOWN";
  }

  const normalized = serviceType
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const serviceMap: Record<string, string> = {
    GENERAL_MESSAGING: "GENERAL_MESSAGING",
    MENSAJERIA: "GENERAL_MESSAGING",

    SUPERMARKET: "SUPERMARKET",
    SUPERMERCADO: "SUPERMARKET",

    PHARMACY: "PHARMACY",
    FARMACIA: "PHARMACY",

    /*
     * FOOD_PICKUP es el valor oficial guardado
     * actualmente en orders.service_type.
     *
     * Todas las variantes anteriores también se
     * normalizan al mismo tipo para mantener
     * compatibilidad con datos viejos.
     */
    FOOD_PICKUP: "FOOD_PICKUP",
    FOOD: "FOOD_PICKUP",
    COMIDA: "FOOD_PICKUP",
    RECOGER_COMIDA: "FOOD_PICKUP",
    "RECOGER COMIDA": "FOOD_PICKUP",
    PICKUP_FOOD: "FOOD_PICKUP",

    PACKAGE: "PACKAGE",
    ENCOMIENDA: "PACKAGE",

    ERRAND: "ERRAND",
    MANDADO: "ERRAND",
  };

  return serviceMap[normalized] ?? "UNKNOWN";
}

function getStatusTone(status: QuoteStatusType): QuoteStatusTone {
  switch (status) {
    case "accepted":
      return "success";

    case "pending":
      return "warning";

    case "rejected":
      return "danger";

    case "expired":
      return "info";

    default:
      return "neutral";
  }
}

function formatMoney(
  value: number | string | null | undefined,
  currency: "CRC" | "USD",
): string {
  const numericValue = Number(value ?? 0);

  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

  const locale = currency === "USD" ? "en-US" : "es-CR";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: currency === "USD" ? 2 : 0,
  }).format(safeValue);
}

function buildMapUrls(
  latitude?: number | string | null,
  longitude?: number | string | null,
) {
  if (
    latitude === null ||
    latitude === undefined ||
    longitude === null ||
    longitude === undefined
  ) {
    return {
      googleMapsUrl: undefined,
      wazeUrl: undefined,
    };
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return {
      googleMapsUrl: undefined,
      wazeUrl: undefined,
    };
  }

  return {
    googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,

    wazeUrl: `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`,
  };
}

export function buildQuoteViewModel({
  order,
  quote,
  language = "es",
}: BuildQuoteViewModelInput): QuoteViewModel {
  const labels = quoteLabels[language];

  console.warn("BUILD QUOTE VIEW MODEL:", {
  language,
  quoteCurrency: quote?.currency,
  quote,
});

  const statusType = normalizeStatus(quote?.status);

  const statusTone = getStatusTone(statusType);

  const normalizedServiceType = normalizeServiceType(order.service_type);

  const mapUrls = buildMapUrls(
    order.addresses?.latitude,
    order.addresses?.longitude,
  );

  const serviceTypeLabel =
    labels.serviceTypes[
      normalizedServiceType as keyof typeof labels.serviceTypes
    ] ?? labels.unknownServiceType;

  const currency: "CRC" | "USD" = quote?.currency === "USD" ? "USD" : "CRC";

  return {
    orderNumber: order.id?.slice(-6).toUpperCase() ?? "------",

    header: {
      title: labels.headerTitle,
      subtitle: labels.headerSubtitle[statusType],
    },

    service: {
      title: labels.serviceTitle,
      typeLabel: labels.serviceType,
      type: serviceTypeLabel,
      description: order.description ?? "",
      statusPrefix: labels.statusPrefix,
      statusLabel: labels.status[statusType],
      statusType,
      statusTone,
    },

    location: {
      title: labels.locationTitle,
      address: order.addresses?.address_line ?? "",

      reference: order.addresses?.reference ?? labels.noReference,

      latitude:
        order.addresses?.latitude !== null &&
        order.addresses?.latitude !== undefined
          ? Number(order.addresses.latitude)
          : null,

      longitude:
        order.addresses?.longitude !== null &&
        order.addresses?.longitude !== undefined
          ? Number(order.addresses.longitude)
          : null,

      googleMapsUrl: mapUrls.googleMapsUrl,
      wazeUrl: mapUrls.wazeUrl,
    },

    /*
     * Esta sección contiene exclusivamente
     * el precio del servicio de entrega.
     *
     * estimated_purchase_amount nunca se suma
     * ni se incluye aquí.
     */
    pricing: {
      title: labels.pricingTitle,

      subtotalLabel: labels.subtotal,
      subtotal: formatMoney(quote?.subtotal, currency),

      deliveryFeeLabel: labels.deliveryFee,
      deliveryFee: formatMoney(quote?.delivery_fee, currency),

      totalLabel: labels.total,
      total: formatMoney(quote?.total, currency),
    },

    purchaseValidation: {
      shouldShow: false,
      title: "",
      amountLabel: "",
      amount: "",
      helperText: "",
      paymentStatusLabel: "",
      paymentStatus: "",
      isFoodPickup: false,
    },

    customerMessage: {
      title: labels.customerMessageTitle,
      message: quote?.notes || labels.noMessage,
    },

    actions: {
      acceptLabel: labels.accept,
      rejectLabel: labels.reject,
      canRespond: statusType === "pending",
    },
  };
}
