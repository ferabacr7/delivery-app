export const translations = {
  es: {
    home: {
      title: "Delivery App",
      createOrder: "Crear Pedido",
      myOrders: "Mis Pedidos",
      slogan: "Lo que necesites,\nlo pedís.",
      description:
        "Compras, comida, mandados y servicios locales desde una sola app.",
      question: "¿Qué necesitás?",
      shopping: "Compras",
      food: "Comida",
      errands: "Mandados",
      services: "Servicios",
      makeOrder: "Hacer Pedido",
    },

    login: {
      title: "Iniciar Sesión",
      email: "Correo Electrónico",
      password: "Contraseña",
      button: "Ingresar",
      noAccount: "¿No tenés cuenta?",
      register: "Registrarse",
      createAccount: "Crear cuenta",
      requiredTitle: "Campos requeridos",
      requiredMessage: "Ingresá correo y contraseña.",
      errorTitle: "Error de Login",
    },

    register: {
      title: "Crear Cuenta",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      button: "Crear Cuenta",
      subtitle:
        "Registrate para hacer pedidos y dar seguimiento a tus entregas.",
      requiredTitle: "Campos requeridos",
      requiredMessage: "Ingresá email y contraseña.",
      errorTitle: "Error al registrarse",
      successTitle: "Registro exitoso",
      successMessage: "Usuario creado correctamente.",
      registerButton: "Registrarme",
      backHome: "Volver al inicio",
    },

    profile: {
      title: "Mi Perfil",
      email: "Correo",
      userId: "ID de Usuario",
      profileName: "Nombre del Perfil",
      status: "Estado",
      logout: "Cerrar sesión",
      loading: "Cargando...",
      noUser: "No hay usuario autenticado.",
      notFound: "Perfil no encontrado o bloqueado por RLS.",
      noName: "Sin nombre",
      loaded: "Perfil cargado correctamente.",
      notAvailable: "No disponible",
      language: "Idioma",
      spanish: "Español",
      english: "Inglés",

      myAddress: "Mi dirección",
      myAddressSubtitle: "Administra tu dirección de entrega",

      aboutApp: "Acerca de la app",
      aboutAppSubtitle: "Información, términos y versión",

      contactSupport: "Contactar al servicio al cliente",
      contactSupportSubtitle: "Estamos aquí para ayudarte",
    },

    addresses: {
      title: "Mis Direcciones",
      subtitle: "Administra tu dirección de entrega.",
      loading: "Cargando dirección...",
      loadError: "No pudimos cargar tu dirección.",
      errorTitle: "Ocurrió un problema",
      retry: "Intentar nuevamente",
      emptyTitle: "No tienes una dirección registrada",
      emptyDescription:
        "Agrega una dirección para poder realizar tus pedidos.",
      add: "Agregar dirección",
      editAccessibility: "Editar dirección",
    },

    orders: {
      title: "Mis Pedidos",
      empty: "Todavía no tenés pedidos registrados.",
      firstOrder: "Hacer mi primer pedido",
      order: "Pedido",
      accepted: "Aceptado",
      rejected: "Rechazado",
      pending: "Pendiente",
    },

    createOrder: {
      title: "Crear Pedido",
      placeholder: "¿Qué necesitás que te traigamos?",
      button: "Enviar Pedido",
      successTitle: "Pedido creado",
      successMessage: "Tu pedido fue enviado correctamente.",
      errorTitle: "Error",
      errorMessage: "No se pudo crear el pedido.",
      subtitle: "Contanos qué necesitás y lo resolvemos por vos.",
      question: "¿Qué necesitás?",
      required: "Por favor escribí tu pedido.",
      optionalDetails: "Detalles opcionales",
      referencePhoto: "Foto de referencia",
      deliveryAddress: "Dirección de entrega",
      additionalNotes: "Notas adicionales",
      creating: "Creando...",
      selectAddress: "Selecciona una dirección.",
      selectService: "Selecciona un tipo de servicio.",
      moreDetail: "El pedido debe tener más detalle.",
      noAddresses: "No tienes direcciones registradas todavía.",
      serviceType: "Tipo de servicio",
      supermarket: "Supermercado",
      pharmacy: "Farmacia",
      foodPickup: "Recoger comida",
      messaging: "Mensajería",
      comingSoon: "Próximamente",
    },

    orderDetail: {
      title: "Detalle del Pedido",
      accepted: "🟢 Pedido Aceptado",
      rejected: "🔴 Pedido Rechazado",
      pending: "🟡 Cotización Pendiente",
      quoteReceived: "Cotización Recibida",
      quoteStatus: "Estado",
      description: "Descripción del pedido",
      createdAt: "Fecha de creación",
      accept: "Aceptar",
      reject: "Rechazar",

      waitingTitle: "Cotización pendiente",
      waitingQuote:
        "Estamos revisando tu pedido. Pronto recibirás una cotización.",

      acceptedMessage: "Tu pedido fue confirmado.",
      rejectedMessage: "Este pedido fue cancelado.",
      processingMessage: "Estamos procesando tu solicitud.",

      backHome: "Volver al inicio",
      backOrders: "Volver a Mis Pedidos",
      currentStatus: "Estado actual",

      quoteAcceptedTitle: "Cotización aceptada",
      quoteAcceptedMessage: "Tu pedido fue aceptado correctamente.",
      quoteRejectedTitle: "Cotización rechazada",
      quoteRejectedMessage: "Rechazaste esta cotización.",

      acceptError: "No se pudo aceptar la cotización.",
      rejectError: "No se pudo rechazar la cotización.",
      notFound: "No se encontró el pedido.",

      trackingTitle: "Seguimiento de entrega",
      trackingDelivered: "Tu pedido fue entregado",
      trackingLive: "Ubicación actualizada en tiempo real",
      trackingWaiting:
        "Disponible cuando el motorizado inicie la entrega",
      trackingUnavailable:
        "Seguimiento no disponible para este pedido",
      updatedRecently: "Actualizado recientemente",
      notAvailable: "Aún no disponible",

      yourDriver: "Tu repartidor",
      driverOnTheWay: "En camino a tu dirección",
      driverNotStarted: "La entrega aún no ha comenzado",

      yourAddress: "Tu dirección",

      estimatedArrival: "Llegada estimada",
      estimatedMinutes: "12–18 min",
      pendingEstimate: "Pendiente",

      deliveryStatus: "Estado de entrega",
      delivered: "Entregado",
      onTheWay: "En camino",
      preparing: "Preparando pedido",
    },

    addressForm: {
      title: "Mi dirección",
      subtitle:
        "Registra una única dirección para recibir tus pedidos durante la beta.",

      labelName: "Nombre de la dirección",
      address: "Dirección",
      reference: "Referencia adicional",

      placeholderLabel: "Casa, trabajo, apartamento...",
      placeholderAddress:
        "Ej: 200m norte del supermercado...",
      placeholderReference:
        "Color del portón, punto de referencia, indicaciones...",

      save: "Guardar dirección",
      saving: "Guardando...",

      savedTitle: "Dirección guardada",
      savedMessage:
        "Tu dirección fue guardada correctamente.",

      nameRequired:
        "Escribe un nombre para la dirección.",
      addressRequired:
        "Escribe la dirección de entrega.",
      saveError:
        "No se pudo guardar la dirección.",
    },

    common: {
      accept: "Aceptar",
      reject: "Rechazar",
      back: "Volver",
      loading: "Cargando...",
      error: "Error",
      address: "Dirección",
    },
  },

  en: {
    home: {
      title: "Delivery App",
      createOrder: "Create Order",
      myOrders: "My Orders",
      slogan: "Whatever you need,\njust order it.",
      description:
        "Shopping, food, errands, and local services from one app.",
      question: "What do you need?",
      shopping: "Shopping",
      food: "Food",
      errands: "Errands",
      services: "Services",
      makeOrder: "Place Order",
    },

    login: {
      title: "Sign In",
      email: "Email",
      password: "Password",
      button: "Sign In",
      noAccount: "Don't have an account?",
      register: "Register",
      createAccount: "Create Account",
      requiredTitle: "Required Fields",
      requiredMessage:
        "Please enter email and password.",
      errorTitle: "Login Error",
    },

    register: {
      title: "Create Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      button: "Create Account",
      subtitle:
        "Register to place orders and track your deliveries.",
      requiredTitle: "Required Fields",
      requiredMessage:
        "Please enter email and password.",
      errorTitle: "Registration Error",
      successTitle: "Registration Successful",
      successMessage: "User created successfully.",
      registerButton: "Register",
      backHome: "Back to Home",
    },

    profile: {
      title: "My Profile",
      email: "Email",
      userId: "User ID",
      profileName: "Profile Name",
      status: "Status",
      logout: "Sign Out",
      loading: "Loading...",
      noUser: "No authenticated user.",
      notFound: "Profile not found or blocked by RLS.",
      noName: "No name",
      loaded: "Profile loaded successfully.",
      notAvailable: "Not available",
      language: "Language",
      spanish: "Spanish",
      english: "English",

      myAddress: "My Address",
      myAddressSubtitle:
        "Manage your delivery address",

      aboutApp: "About the App",
      aboutAppSubtitle:
        "Information, terms, and version",

      contactSupport:
        "Contact Customer Support",
      contactSupportSubtitle:
        "We are here to help",
    },

    addresses: {
      title: "My Addresses",
      subtitle: "Manage your delivery address.",
      loading: "Loading address...",
      loadError:
        "We could not load your address.",
      errorTitle: "Something went wrong",
      retry: "Try Again",
      emptyTitle:
        "You do not have a saved address",
      emptyDescription:
        "Add an address so you can place your orders.",
      add: "Add Address",
      editAccessibility: "Edit address",
    },

    orders: {
      title: "My Orders",
      empty: "You don't have any orders yet.",
      firstOrder: "Place My First Order",
      order: "Order",
      accepted: "Accepted",
      rejected: "Rejected",
      pending: "Pending",
    },

    createOrder: {
      title: "Create Order",
      placeholder:
        "What do you need us to bring?",
      button: "Submit Order",
      successTitle: "Order Created",
      successMessage:
        "Your order was submitted successfully.",
      errorTitle: "Error",
      errorMessage:
        "The order could not be created.",
      subtitle:
        "Tell us what you need and we will take care of it.",
      question: "What do you need?",
      required: "Please enter your order.",
      optionalDetails: "Optional Details",
      referencePhoto: "Reference Photo",
      deliveryAddress: "Delivery Address",
      additionalNotes: "Additional Notes",
      creating: "Creating...",
      selectAddress: "Select an address.",
      selectService: "Select a service type.",
      moreDetail:
        "Please provide more details about the order.",
      noAddresses:
        "You do not have any saved addresses yet.",
      serviceType: "Service Type",
      supermarket: "Supermarket",
      pharmacy: "Pharmacy",
      foodPickup: "Food Pickup",
      messaging: "Messaging",
      comingSoon: "Coming Soon",
    },

    orderDetail: {
      title: "Order Details",
      accepted: "🟢 Order Accepted",
      rejected: "🔴 Order Rejected",
      pending: "🟡 Quote Pending",
      quoteReceived: "Quote Received",
      quoteStatus: "Status",
      description: "Order Description",
      createdAt: "Created At",
      accept: "Accept",
      reject: "Reject",

      waitingTitle: "Quote Pending",
      waitingQuote:
        "We are reviewing your order. You will receive a quote soon.",

      acceptedMessage:
        "Your order was confirmed.",
      rejectedMessage:
        "This order was cancelled.",
      processingMessage:
        "We are processing your request.",

      backHome: "Back to Home",
      backOrders: "Back to My Orders",
      currentStatus: "Current Status",

      quoteAcceptedTitle: "Quote Accepted",
      quoteAcceptedMessage:
        "Your order was accepted successfully.",
      quoteRejectedTitle: "Quote Rejected",
      quoteRejectedMessage:
        "You rejected this quote.",

      acceptError:
        "The quote could not be accepted.",
      rejectError:
        "The quote could not be rejected.",
      notFound: "Order not found.",

      trackingTitle: "Delivery tracking",
      trackingDelivered:
        "Your order was delivered",
      trackingLive:
        "Location updates in real time",
      trackingWaiting:
        "Available when the driver starts the delivery",
      trackingUnavailable:
        "Tracking is unavailable for this order",
      updatedRecently: "Updated recently",
      notAvailable: "Not available yet",

      yourDriver: "Your driver",
      driverOnTheWay:
        "On the way to your address",
      driverNotStarted:
        "The delivery has not started yet",

      yourAddress: "Your address",

      estimatedArrival:
        "Estimated arrival",
      estimatedMinutes: "12–18 min",
      pendingEstimate: "Pending",

      deliveryStatus: "Delivery status",
      delivered: "Delivered",
      onTheWay: "On the way",
      preparing: "Preparing order",
    },

    addressForm: {
      title: "My Address",
      subtitle:
        "Register a single delivery address for the beta version.",

      labelName: "Address name",
      address: "Address",
      reference: "Additional reference",

      placeholderLabel:
        "Home, work, apartment...",
      placeholderAddress:
        "Example: 200 meters north of the supermarket...",
      placeholderReference:
        "Gate color, landmark, delivery instructions...",

      save: "Save Address",
      saving: "Saving...",

      savedTitle: "Address Saved",
      savedMessage:
        "Your address was saved successfully.",

      nameRequired:
        "Enter a name for the address.",
      addressRequired:
        "Enter the delivery address.",
      saveError:
        "The address could not be saved.",
    },

    common: {
      accept: "Accept",
      reject: "Reject",
      back: "Back",
      loading: "Loading...",
      error: "Error",
      address: "Address",
    },
  },
};

export type Language = keyof typeof translations;