import { quoteLabels, QuoteLanguage } from "./labels";

import {
  QuoteStatusType,
  QuoteStatusTone,
  QuoteViewModel,
} from "./QuoteViewModel";

type OrderLike = {
  id?: string;
  description?: string | null;
  status?: string | null;
  addresses?: {
    address_line?: string |null;
    reference?: string | null;
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

export function buildQuoteViewModel({
  order,
  quote,
  language = "es",
}: BuildQuoteViewModelInput): QuoteViewModel {
  const labels = quoteLabels[language];

  const statusType = normalizeStatus(quote?.status);
  const statusTone = getStatusTone(statusType);

  return {
    header: {
      title: labels.headerTitle,
      subtitle: labels.headerSubtitle,
    },

    service: {
      title: labels.serviceTitle,
      description: order.description ?? "",
      statusLabel: labels.status[statusType],
      statusType,
      statusTone,
    },

    location: {
      title: labels.locationTitle,
      address: order.addresses?.address_line ?? "",
      reference: order.addresses?.reference ?? labels.noReference,
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