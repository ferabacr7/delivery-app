export const quoteLabels = {
  es: {
    headerTitle: "Detalle del pedido",
    headerSubtitle: "Revisá la cotización antes de responder",

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
  },

  en: {
    headerTitle: "Order details",
    headerSubtitle: "Review the quote before responding",

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
  },
};

export type QuoteLanguage = keyof typeof quoteLabels;