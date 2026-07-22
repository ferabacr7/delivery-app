export const quoteLabels = {
  es: {
    headerTitle: "Detalle del pedido",

    headerSubtitle: {
      pending: "Revisá la cotización antes de responder.",
      accepted: "Tu pedido fue confirmado.",
      rejected: "Has rechazado esta cotización.",
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

    subtotal: "Tarifa base",
    deliveryFee: "Costo de entrega",
    total: "Total del servicio",

    purchaseValidationTitle: "Referencia de compra",
    estimatedPurchaseAmount: "Monto estimado de compra",

    purchaseValidationHelper:
      "Este monto se utiliza únicamente para validar que el pedido se encuentre dentro del límite permitido. No forma parte del total del servicio de entrega.",

    paymentStatusLabel: "Estado del pago del restaurante",
    foodOrderPaid: "Ya pagado",
    foodOrderNotPaid: "Pendiente de pago",

    accept: "Aceptar cotización",
    reject: "Rechazar",

    noReference: "Sin referencia adicional",
    noMessage: "Sin mensaje adicional",

    status: {
      pending: "Pendiente",
      accepted: "Aceptada",
      rejected: "Rechazada",
      expired: "Expirada",
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
      pending: "Review the quote before responding.",
      accepted: "Your order has been confirmed.",
      rejected: "You rejected this quote.",
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

    subtotal: "Base fee",
    deliveryFee: "Delivery fee",
    total: "Service total",

    purchaseValidationTitle: "Purchase reference",
    estimatedPurchaseAmount: "Estimated purchase amount",

    purchaseValidationHelper:
      "This amount is used only to validate that the order is within the permitted limit. It is not part of the delivery service total.",

    paymentStatusLabel: "Restaurant payment status",
    foodOrderPaid: "Already paid",
    foodOrderNotPaid: "Payment pending",

    accept: "Accept quote",
    reject: "Reject",

    noReference: "No additional reference",
    noMessage: "No additional message",

    status: {
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
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