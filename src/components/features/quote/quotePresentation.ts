import { QuoteLanguage, quoteLabels } from "./labels";
import {
  QuoteStatusTone,
  QuoteStatusType,
  QuoteViewModel,
} from "./QuoteViewModel";

type OrderLike = {
  id?: string;
  description?: string | null;
  status?: string | null;
  addresses?: {
    address_line?: string | null;
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

  if (value === "PENDING") return "pending";
  if (value === "ACCEPTED") return "accepted";
  if (value === "REJECTED") return "rejected";
  if (value === "EXPIRED") return "expired";

  return "unknown";
}

function getStatusTone(status: QuoteStatusType): QuoteStatusTone {
  if (status === "accepted") return "success";
  if (status === "pending") return "warning";
  if (status === "rejected") return "danger";
  if (status === "expired") return "info";

  return "neutral";
}

function formatMoney(value?: number | string | null) {
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