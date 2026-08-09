import { quoteLabels, QuoteLanguage } from "./labels";

import {
  QuoteStatusType,
  QuoteStatusTone,
  QuoteViewModel,
} from "./QuoteViewModel";

type SupportedCurrency = "CRC" | "USD";

type OrderLike = {
  id?: string;
  description?: string | null;
  service_type?: string | null;
  status?: string | null;

  pickup_location?: string | null;
  courier_weight?: string | null;
  payment_method?: "SINPE" | "CASH" | null;

  /*
   * Este monto es únicamente una referencia operativa
   * para validar que la compra esté dentro del límite permitido.
   *
   * No forma parte del subtotal, la tarifa de entrega
   * ni el total del servicio.
   */
  estimated_purchase_amount?: number | string | null;

  /*
   * Moneda original del monto estimado de compra.
   */
  estimated_purchase_currency?: SupportedCurrency | null;

  /*
   * Solo aplica para FOOD_PICKUP.
   *
   * true  = el pedido del restaurante ya fue pagado.
   * false = el repartidor deberá pagarlo al recogerlo.
   * null  = no aplica o no fue especificado.
   */
  food_order_paid?: boolean | null;
  courier_order_paid?: boolean | null;

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

  /**
   * Valores oficiales/base en CRC.
   *
   * Las cotizaciones nuevas los guardan para evitar
   * reconstruir CRC desde montos USD redondeados.
   */
  service_fee_crc?: number | string | null;
  delivery_fee_crc?: number | string | null;
  subtotal_crc?: number | string | null;
  total_crc?: number | string | null;

  currency?: SupportedCurrency | null;
  notes?: string | null;
  status?: string | null;
};

type BuildQuoteViewModelInput = {
  order: OrderLike;
  quote: QuoteLike | null;
  language?: QuoteLanguage;

  /*
   * Cantidad de colones equivalentes a 1 dólar.
   *
   * Ejemplo:
   * 1 USD = 505 CRC
   * exchangeRate = 505
   */
  exchangeRate?: number | null;
};

/*
 * Normaliza exclusivamente el estado operativo del pedido.
 *
 * Este estado controla:
 * - encabezado
 * - timeline
 * - tracking
 * - badge
 * - mensaje operativo
 */
function normalizeOrderStatus(status?: string | null): QuoteStatusType {
  const value = status?.trim().toUpperCase();

  switch (value) {
    case "VALIDATION":
      return "validation";

    case "QUOTED":
      return "quoted";

    case "ACCEPTED":
      return "accepted";

    case "IN_PROGRESS":
      return "in_progress";

    case "ON_ROUTE":
    case "EN_ROUTE":
      return "on_route";

    case "DELIVERED":
      return "delivered";

    case "REJECTED":
      return "rejected";

    case "CANCELLED":
    case "CANCELED":
      return "cancelled";

    default:
      return "unknown";
  }
}

/*
 * Normaliza exclusivamente el estado de la cotización.
 *
 * Este estado controla principalmente:
 * - aceptar cotización
 * - rechazar cotización
 * - cotización vencida
 */
function normalizeQuoteStatus(status?: string | null): QuoteStatusType {
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
    case "delivered":
      return "success";

    case "validation":
    case "quoted":
    case "pending":
      return "warning";

    case "rejected":
    case "cancelled":
      return "danger";

    case "in_progress":
    case "on_route":
    case "expired":
      return "info";

    default:
      return "neutral";
  }
}

function formatMoney(
  value: number | string | null | undefined,
  currency: SupportedCurrency,
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

/*
 * Redondea hacia arriba al siguiente múltiplo de $0.50.
 *
 * Ejemplos:
 * 6.12 → 6.50
 * 6.50 → 6.50
 * 6.86 → 7.00
 */
function roundUsdAmount(amount: number) {
  return Math.ceil(amount * 2) / 2;
}

/*
 * Convierte un monto únicamente para presentación.
 *
 * Nunca modifica los datos guardados en Supabase.
 */
function convertMoneyForDisplay({
  value,
  storedCurrency,
  displayCurrency,
  exchangeRate,
}: {
  value: number | string | null | undefined;
  storedCurrency: SupportedCurrency;
  displayCurrency: SupportedCurrency;
  exchangeRate: number | null;
}): number {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  /*
   * Si la moneda guardada coincide con la moneda
   * que debe mostrarse, no se realiza conversión.
   */
  if (storedCurrency === displayCurrency) {
    return numericValue;
  }

  const validExchangeRate =
    exchangeRate !== null && Number.isFinite(exchangeRate) && exchangeRate > 0;

  if (!validExchangeRate) {
    console.warn("QUOTE PRESENTATION: Invalid exchange rate.", {
      storedCurrency,
      displayCurrency,
      exchangeRate,
      value: numericValue,
    });

    /*
     * No cambiamos solamente el símbolo porque eso
     * produciría un valor monetario incorrecto.
     */
    return numericValue;
  }

  /*
   * CRC → USD
   */
  if (storedCurrency === "CRC" && displayCurrency === "USD") {
    return roundUsdAmount(numericValue / exchangeRate);
  }

  /*
   * USD → CRC
   */
  if (storedCurrency === "USD" && displayCurrency === "CRC") {
    return Math.round(numericValue * exchangeRate);
  }

  return numericValue;
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
  exchangeRate = null,
}: BuildQuoteViewModelInput): QuoteViewModel {
  const labels = quoteLabels[language];

  const orderStatusType = normalizeOrderStatus(order.status);

  const quoteStatusType = normalizeQuoteStatus(quote?.status);

  const presentationStatusType =
    orderStatusType !== "unknown" ? orderStatusType : quoteStatusType;

  const statusTone = getStatusTone(presentationStatusType);

  const normalizedServiceType = normalizeServiceType(order.service_type);

  const mapUrls = buildMapUrls(
    order.addresses?.latitude,
    order.addresses?.longitude,
  );

  const serviceTypeLabel =
    labels.serviceTypes[
      normalizedServiceType as keyof typeof labels.serviceTypes
    ] ?? labels.unknownServiceType;

  /*
   * Moneda en la que la cotización fue guardada.
   */
  const storedQuoteCurrency: SupportedCurrency =
    quote?.currency === "USD" ? "USD" : "CRC";

  /*
   * Moneda que debe mostrarse según el idioma actual.
   *
   * Español → CRC
   * Inglés  → USD
   */
  const displayCurrency: SupportedCurrency = language === "en" ? "USD" : "CRC";

  /*
   * Conversión visual del precio del servicio.
   */
  /**
   * Comprueba si existe un monto base CRC válido.
   */
  function getBaseCrcAmount(
    value: number | string | null | undefined,
  ): number | null {
    if (
      value === null ||
      value === undefined
    ) {
      return null;
    }

    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? numericValue
      : null;
  }

  const baseSubtotalCrc =
    getBaseCrcAmount(
      quote?.subtotal_crc,
    );

  const baseDeliveryFeeCrc =
    getBaseCrcAmount(
      quote?.delivery_fee_crc,
    );

  const baseTotalCrc =
    getBaseCrcAmount(
      quote?.total_crc,
    );

  /**
   * Español:
   *
   * Si tenemos los valores oficiales CRC guardados,
   * los utilizamos directamente.
   *
   * Esto evita:
   *
   * $8 × 505 = ₡4.040
   *
   * cuando el precio original era ₡4.000.
   *
   * Cotizaciones antiguas que todavía no tienen
   * *_crc continúan utilizando la conversión anterior
   * como fallback.
   */
  const displaySubtotal =
    displayCurrency === "CRC" &&
    baseSubtotalCrc !== null
      ? baseSubtotalCrc
      : convertMoneyForDisplay({
          value: quote?.subtotal,
          storedCurrency:
            storedQuoteCurrency,
          displayCurrency,
          exchangeRate,
        });

  const displayDeliveryFee =
    displayCurrency === "CRC" &&
    baseDeliveryFeeCrc !== null
      ? baseDeliveryFeeCrc
      : convertMoneyForDisplay({
          value: quote?.delivery_fee,
          storedCurrency:
            storedQuoteCurrency,
          displayCurrency,
          exchangeRate,
        });

  const displayTotal =
    displayCurrency === "CRC" &&
    baseTotalCrc !== null
      ? baseTotalCrc
      : convertMoneyForDisplay({
          value: quote?.total,
          storedCurrency:
            storedQuoteCurrency,
          displayCurrency,
          exchangeRate,
        });

  const isFoodPickup = normalizedServiceType === "FOOD_PICKUP";

  const isCourier = normalizedServiceType === "GENERAL_MESSAGING";

  const requiresPurchaseAmount =
    normalizedServiceType === "SUPERMARKET" ||
    normalizedServiceType === "PHARMACY" ||
    (isFoodPickup && order.food_order_paid === false);

  const hasEstimatedPurchaseAmount =
    order.estimated_purchase_amount !== null &&
    order.estimated_purchase_amount !== undefined &&
    Number.isFinite(Number(order.estimated_purchase_amount));

  const shouldShowPurchaseValidation = requiresPurchaseAmount || isFoodPickup;

  /*
   * Moneda original del monto estimado.
   *
   * Si el campo no existe en pedidos antiguos,
   * usamos CRC como respaldo.
   */
  const storedPurchaseCurrency: SupportedCurrency =
    order.estimated_purchase_currency === "USD" ? "USD" : "CRC";

  const displayPurchaseAmount = convertMoneyForDisplay({
    value: order.estimated_purchase_amount,
    storedCurrency: storedPurchaseCurrency,
    displayCurrency,
    exchangeRate,
  });

  const purchaseAmount =
    requiresPurchaseAmount && hasEstimatedPurchaseAmount
      ? formatMoney(displayPurchaseAmount, displayCurrency)
      : null;

  const paymentStatus = isFoodPickup
    ? order.food_order_paid === true
      ? labels.foodOrderPaid
      : order.food_order_paid === false
        ? labels.foodOrderNotPaid
        : null
    : null;

 const courierPaymentStatus = isCourier
  ? order.courier_order_paid === true
    ? language === "en"
      ? "Payment completed at the store"
      : "Pago realizado en el comercio"
    : order.courier_order_paid === false
      ? language === "en"
        ? "Payment pending at the store"
        : "Pago pendiente en el comercio"
      : null
  : null;

  const estimatedArrival = (() => {
    switch (presentationStatusType) {
      case "accepted":
        return language === "en" ? "20–30 min" : "20–30 minutos";

      case "in_progress":
        return language === "en" ? "15–25 min" : "15–25 minutos";

      case "on_route":
        return language === "en" ? "8–15 min" : "8–15 minutos";

      case "delivered":
        return language === "en" ? "Delivered" : "Entregado";

      case "rejected":
        return language === "en" ? "Quote rejected" : "Cotización rechazada";

      case "expired":
        return language === "en" ? "Quote expired" : "Cotización vencida";

      case "quoted":
        return language === "en"
          ? "Awaiting confirmation"
          : "Esperando confirmación";

      case "pending":
      case "unknown":
      default:
        return language === "en" ? "Pending" : "Pendiente";
    }
  })();

   console.warn("QUOTE PRESENTATION CURRENCY:", {
    language,
    storedQuoteCurrency,
    displayCurrency,
    storedPurchaseCurrency,
    exchangeRate,

    originalSubtotal: quote?.subtotal,
    baseSubtotalCrc:
      quote?.subtotal_crc,
    displaySubtotal,

    originalDeliveryFee:
      quote?.delivery_fee,
    baseDeliveryFeeCrc:
      quote?.delivery_fee_crc,
    displayDeliveryFee,

    originalTotal: quote?.total,
    baseTotalCrc:
      quote?.total_crc,
    displayTotal,

    originalPurchaseAmount:
      order.estimated_purchase_amount,
    displayPurchaseAmount,
  });

  return {
    orderNumber: order.id?.slice(-6).toUpperCase() ?? "------",

    header: {
      title: labels.headerTitle,

      subtitle: labels.headerSubtitle[presentationStatusType],
    },

    service: {
      title: labels.serviceTitle,
      typeLabel: labels.serviceType,
      type: serviceTypeLabel,
      description: order.description ?? "",
      statusPrefix: labels.statusPrefix,

      statusLabel: labels.status[presentationStatusType],

      statusType: presentationStatusType,
      statusTone,
    },

    orderDetails: {
      pickupLocation: order.pickup_location?.trim() || null,
      courierWeight: order.courier_weight?.trim() || null,
      paymentMethod: order.payment_method ?? null,
      courierPaymentStatus,
    },

    location: {
      title: labels.locationTitle,

      address: order.addresses?.address_line ?? "",

      reference: order.addresses?.reference ?? labels.noReference,

      latitude:
        order.addresses?.latitude !== null &&
        order.addresses?.latitude !== undefined &&
        Number.isFinite(Number(order.addresses.latitude))
          ? Number(order.addresses.latitude)
          : null,

      longitude:
        order.addresses?.longitude !== null &&
        order.addresses?.longitude !== undefined &&
        Number.isFinite(Number(order.addresses.longitude))
          ? Number(order.addresses.longitude)
          : null,

      googleMapsUrl: mapUrls.googleMapsUrl,

      wazeUrl: mapUrls.wazeUrl,
    },

    tracking: {
      estimatedArrival,

      estimatedArrivalLabel:
        language === "en" ? "Estimated arrival" : "Llegada estimada",

      lastUpdate: "",

      lastUpdateLabel:
        language === "en" ? "Last update" : "Última actualización",
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

      subtotalLabel: serviceTypeLabel,

      subtotal: formatMoney(displaySubtotal, displayCurrency),

      deliveryFeeLabel: labels.deliveryFee,

      deliveryFee: formatMoney(displayDeliveryFee, displayCurrency),

      totalLabel: labels.total,

      total: formatMoney(displayTotal, displayCurrency),
    },

    purchaseValidation: {
      shouldShow: shouldShowPurchaseValidation,

      title: labels.purchaseValidationTitle,

      amountLabel: labels.estimatedPurchaseAmount,

      amount: purchaseAmount,

      helperText: labels.purchaseValidationHelper,

      paymentStatusLabel: labels.paymentStatusLabel,

      paymentStatus,

      isFoodPickup,
    },

    customerMessage: {
      title: labels.customerMessageTitle,

      message: quote?.notes || labels.noMessage,
    },

    actions: {
      acceptLabel: labels.accept,
      rejectLabel: labels.reject,

      /*
       * Una cotización solamente puede responderse cuando:
       *
       * 1. El pedido está oficialmente en QUOTED.
       * 2. La cotización continúa en PENDING.
       */
      canRespond: orderStatusType === "quoted" && quoteStatusType === "pending",
    },
  };
}
