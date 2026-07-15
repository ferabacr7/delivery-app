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
    pricingTitle: "Resumen del pago",
    customerMessageTitle: "Mensaje para el cliente",

    subtotal: "Subtotal",
    deliveryFee: "Costo de entrega",
    total: "Total",

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
      FOOD: "Comida",
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
    pricingTitle: "Payment summary",
    customerMessageTitle: "Message for the customer",

    subtotal: "Subtotal",
    deliveryFee: "Delivery fee",
    total: "Total",

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
      GENERAL_MESSAGING: "Messaging",
      SUPERMARKET: "Supermarket",
      PHARMACY: "Pharmacy",
      FOOD: "Food",
      PACKAGE: "Package delivery",
      ERRAND: "Errand",
    },
  },
};

export type QuoteLanguage = keyof typeof quoteLabels;
