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
  notes?: string | null;
  status?: string | null;
};

type BuildQuoteViewModelInput = {
  order: OrderLike;
  quote: QuoteLike | null;
  language?: QuoteLanguage;
};

function normalizeStatus(status?: string | null): QuoteStatusType {
  const value = status?.toUpperCase();

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
  if (!serviceType) return "UNKNOWN";

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

    FOOD: "FOOD",
    COMIDA: "FOOD",
    RECOGER_COMIDA: "FOOD",
    "RECOGER COMIDA": "FOOD",
    PICKUP_FOOD: "FOOD",

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

function formatMoney(value?: number | string | null): string {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function buildMapUrls(
  latitude?: number | string | null,
  longitude?: number | string | null,
) {
  if (!latitude || !longitude) {
    return {
      googleMapsUrl: undefined,
      wazeUrl: undefined,
    };
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
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

  const statusType = normalizeStatus(quote?.status);
  const statusTone = getStatusTone(statusType);
  const normalizedServiceType = normalizeServiceType(order.service_type);

  const mapUrls = buildMapUrls(
    order.addresses?.latitude,
    order.addresses?.longitude,
  );

  return {
    orderNumber: order.id?.slice(-6).toUpperCase() ?? "------",

    header: {
      title: labels.headerTitle,
      subtitle: labels.headerSubtitle[statusType],
    },

    service: {
      title: labels.serviceTitle,
      typeLabel: labels.serviceType,
      type:
        labels.serviceTypes[
          normalizedServiceType as keyof typeof labels.serviceTypes
        ] ?? labels.unknownServiceType,
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
      latitude: order.addresses?.latitude
        ? Number(order.addresses.latitude)
        : null,
      longitude: order.addresses?.longitude
        ? Number(order.addresses.longitude)
        : null,
      googleMapsUrl: mapUrls.googleMapsUrl,
      wazeUrl: mapUrls.wazeUrl,
    },

    pricing: {
      title: labels.pricingTitle,
      subtotalLabel: labels.subtotal,
      subtotal: formatMoney(quote?.subtotal),
      deliveryFeeLabel: labels.deliveryFee,
      deliveryFee: formatMoney(quote?.delivery_fee),
      totalLabel: labels.total,
      total: formatMoney(quote?.total),
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
