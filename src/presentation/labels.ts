export const quoteLabels = {
  es: {
    headerTitle: "Detalle del pedido",

    headerSubtitle: {
      validation: "Estamos revisando la información de tu pedido.",
      quoted: "Revisá la cotización antes de responder.",
      pending: "Revisá la cotización antes de responder.",
      accepted: "Tu pedido fue confirmado.",
      in_progress: "Estamos preparando tu pedido.",
      on_route: "Tu pedido está en camino.",
      delivered: "Tu pedido fue entregado.",
      rejected: "La cotización fue rechazada.",
      cancelled: "Este pedido fue cancelado.",
      expired: "Esta cotización ha expirado.",
      unknown: "",
    },

    serviceTitle: "Servicio solicitado",
    locationTitle: "Dirección de entrega",

    /*
     * Esta sección representa únicamente
     * lo que cobra Delivery App.
     */
    pricingTitle: "Detalle del servicio",

    customerMessageTitle: "Mensaje para el cliente",

    estimatedArrival: "Llegada estimada",
    estimatedMinutes: "12–18 minutos",
    pendingEstimate: "Pendiente",
    lastUpdate: "Última actualización",
    delivered: "Entregado",

    subtotal: "Tarifa base",
    deliveryFee: "Costo de entrega",
    total: "Total del servicio",

    purchaseValidationTitle: "Detalles de la compra",
    estimatedPurchaseAmount: "Monto estimado",

    purchaseValidationHelper:
      "Este monto corresponde a una estimación de los productos y no forma parte del costo del servicio de entrega.",

    paymentStatusLabel: "Estado del pago",
    foodOrderPaid: "Pagado",
    foodOrderNotPaid: "Pendiente de pago",

    accept: "Aceptar cotización",
    reject: "Rechazar",

    noReference: "Sin referencia adicional",
    noMessage: "Sin mensaje adicional",

    status: {
      validation: "En validación",
      quoted: "Cotización disponible",
      pending: "Pendiente",
      accepted: "Aceptado",
      in_progress: "En preparación",
      on_route: "En camino",
      delivered: "Entregado",
      rejected: "Rechazado",
      cancelled: "Cancelado",
      expired: "Expirado",
      unknown: "Sin estado",
    },

    serviceType: "Tipo de servicio",
    unknownServiceType: "Servicio no especificado",
    statusPrefix: "Estado",

    serviceTypes: {
      GENERAL_MESSAGING: "Mensajería",
      SUPERMARKET: "Supermercado",
      PHARMACY: "Farmacia",
      FOOD_PICKUP: "Recoger comida",
      PACKAGE: "Encomienda",
      ERRAND: "Mandado",
    },
  },

  en: {
    headerTitle: "Order details",

    headerSubtitle: {
      validation: "We are reviewing your order information.",
      quoted: "Review the quote before responding.",
      pending: "Review the quote before responding.",
      accepted: "Your order has been confirmed.",
      in_progress: "We are preparing your order.",
      on_route: "Your order is on the way.",
      delivered: "Your order has been delivered.",
      rejected: "The quote was rejected.",
      cancelled: "This order was cancelled.",
      expired: "This quote has expired.",
      unknown: "",
    },

    serviceTitle: "Requested service",
    locationTitle: "Delivery address",

    /*
     * This section contains only
     * the Delivery App service charges.
     */
    pricingTitle: "Service details",

    customerMessageTitle: "Message for the customer",

    estimatedArrival: "Estimated arrival",
    estimatedMinutes: "12–18 min",
    pendingEstimate: "Pending",
    lastUpdate: "Last update",
    delivered: "Delivered",

    subtotal: "Base fee",
    deliveryFee: "Delivery fee",
    total: "Service total",

    purchaseValidationTitle: "Purchase details",
    estimatedPurchaseAmount: "Estimated amount",

    purchaseValidationHelper:
      "This amount is an estimate of the purchased products and is not included in the delivery service cost.",

    paymentStatusLabel: "Payment status",
    foodOrderPaid: "Paid",
    foodOrderNotPaid: "Payment pending",

    accept: "Accept quote",
    reject: "Reject",

    noReference: "No additional reference",
    noMessage: "No additional message",

    status: {
      validation: "Under review",
      quoted: "Quote available",
      pending: "Pending",
      accepted: "Accepted",
      in_progress: "In preparation",
      on_route: "On the way",
      delivered: "Delivered",
      rejected: "Rejected",
      cancelled: "Cancelled",
      expired: "Expired",
      unknown: "No status",
    },

    serviceType: "Service type",
    unknownServiceType: "Unspecified service",
    statusPrefix: "Status",

    serviceTypes: {
      GENERAL_MESSAGING: "Courier service",
      SUPERMARKET: "Supermarket",
      PHARMACY: "Pharmacy",
      FOOD_PICKUP: "Food pickup",
      PACKAGE: "Package delivery",
      ERRAND: "Errand",
    },
  },
};

export type QuoteLanguage = keyof typeof quoteLabels;
