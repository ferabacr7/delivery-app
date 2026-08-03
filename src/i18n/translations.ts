export const translations = {
  es: {
    home: {
      title: "Boomerang",
      slogan: "Lo que necesites, lo pedís.",
      description: "Pedí lo que necesités y nosotros nos encargamos.",
      question: "¿Qué necesitás hoy?",

      supermarket: "Supermercado",
      restaurant: "Restaurante",
      pharmacy: "Farmacia",
      messaging: "Mensajería",

      makeOrder: "Hacer pedido",
    },

    bottomNavigation: {
      home: "Inicio",
      orders: "Pedidos",
      create: "Nuevo",
      profile: "Perfil",
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
      registering: "Creando cuenta...",
      backHome: "Volver al inicio",
      fullName: "Nombre completo",
      phone: "Número de teléfono",
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
      emptyDescription: "Agrega una dirección para poder realizar tus pedidos.",
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
      foodPickup: "Restaurante",
      messaging: "Mensajería",

      courierWeightTitle: "Peso aproximado",

      courierLightTitle: "Ligero (0–2 kg)",
      courierLightDescription:
        "Documentos, medicamentos, llaves o paquetes pequeños.",

      courierMediumTitle: "Mediano (2–10 kg)",
      courierMediumDescription:
        "Compras pequeñas, cajas o electrodomésticos pequeños.",

      courierHeavyTitle: "Pesado (10–25 kg)",
      courierHeavyDescription: "Cajas grandes, hieleras o sacos de alimento.",

      courierManualReview:
        "Si el paquete supera los 25 kg o es demasiado voluminoso, la cotización requerirá revisión manual.",

      estimatedPurchaseTitle: "Monto estimado de la compra",
      estimatedPurchaseApproximately: "Aproximadamente",
      estimatedPurchaseHelper:
        "Mueva la barra para seleccionar un monto aproximado. El monto final se confirmará con la factura del comercio.",
      estimatedPurchaseAccessibility: "Monto estimado de la compra",

      foodPaymentTitle: "¿Su pedido ya fue pagado?",
      foodPaymentYes: "Sí, ya fue pagado",
      foodPaymentYesDescription:
        "El repartidor solamente recogerá y entregará el pedido.",

      foodPaymentNo: "No, falta pagarlo",
      foodPaymentNoDescription:
        "El repartidor deberá pagar el pedido al recogerlo.",

      foodPaymentRequired: "Indique si el pedido de comida ya fue pagado.",

      estimatedPurchaseValidationHelper:
        "Seleccione un monto aproximado para validar que la compra esté dentro del límite permitido.",

      estimatedPurchaseSeparateCharge:
        "Este monto no forma parte de la tarifa del servicio de entrega. La compra se paga por separado según la factura del comercio.",

      minimumPurchaseAmount: "Mínimo",
      maximumPurchaseAmount: "Máximo",

      purchaseAmountOutOfRange:
        "El monto estimado está fuera del rango permitido.",

      comingSoon: "Próximamente",

      addAddress: "Agregar dirección",

      pickupLocation: "Lugar de retiro",

      preferredSupermarket: "Supermercado de preferencia",
      preferredSupermarketPlaceholder:
        "Ej: Super Compro, Maxi Palí, Automercado",

      preferredPharmacy: "Farmacia de preferencia",
      preferredPharmacyPlaceholder: "Ej: Farmacia La Bomba, Fischel",

      restaurantPickupPlaceholder: "Ej: Restaurante El Tiki, Flamingo",

      messagingPickupPlaceholder: "Ej: Hotel, comercio, casa o punto de retiro",

      pickupLocationRequired: "Indica el lugar de retiro.",
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
      trackingWaiting: "Disponible cuando el motorizado inicie la entrega",
      trackingUnavailable: "Seguimiento no disponible para este pedido",
      updatedRecently: "Actualizado recientemente",
      notAvailable: "Aún no disponible",

      yourDriver: "Tu repartidor",
      driverOnTheWay: "En camino a tu dirección",
      driverNotStarted: "La entrega aún no ha comenzado",

      yourAddress: "Tu dirección",

      estimatedArrival: "Llegada estimada",
      estimatedMinutes: "12–18 min",
      pendingEstimate: "Pendiente",

      showPriceDetail: "Ver detalle",
      hidePriceDetail: "Ocultar detalle",

      deliveryStatus: "Estado de entrega",
      delivered: "Entregado",
      onTheWay: "En camino",
      preparing: "Preparando pedido",
    },

    addressForm: {
      title: "Mi dirección",
      editTitle: "Editar dirección",

      subtitle:
        "Registra una única dirección para recibir tus pedidos durante la beta.",

      automaticSubtitle:
        "Usaremos tu ubicación actual para detectar automáticamente tu dirección. Solo tendrás que agregar algunas indicaciones adicionales si lo deseas.",

      labelName: "Nombre de la dirección",
      address: "Dirección",
      reference: "Referencia adicional",

      detectedLocation: "Ubicación detectada",

      locationReady: "Tu ubicación fue detectada correctamente.",

      locationWaiting: "Esperando obtener tu ubicación.",

      detectingLocation: "Detectando ubicación...",

      noLocationDetected: "Todavía no se ha detectado una ubicación.",

      detectLocation: "Detectar ubicación",

      updateLocation: "Actualizar ubicación",

      additionalNotes: "Indicaciones adicionales",

      additionalNotesPlaceholder:
        "Ej: Casa blanca, portón negro, segundo piso, frente al supermercado...",

      placeholderLabel: "Casa, trabajo, apartamento...",

      placeholderAddress: "Ej: 200m norte del supermercado...",

      placeholderReference:
        "Color del portón, punto de referencia, indicaciones...",

      save: "Guardar dirección",

      update: "Actualizar dirección",

      saving: "Guardando...",

      loading: "Cargando dirección...",

      savedTitle: "Dirección guardada",

      savedMessage: "Tu dirección fue guardada correctamente.",

      updatedMessage: "Tu dirección fue actualizada correctamente.",

      locationPermissionTitle: "Permiso de ubicación",

      locationPermissionMessage:
        "Necesitamos acceso a tu ubicación para detectar automáticamente tu dirección.",

      locationDetectedTitle: "Ubicación detectada",

      addressUnavailable:
        "No fue posible obtener una dirección exacta. Se guardarán las coordenadas.",

      locationError: "No fue posible obtener tu ubicación actual.",

      locationRequired: "Primero debemos detectar tu ubicación.",

      nameRequired: "Escribe un nombre para la dirección.",

      addressRequired: "Escribe la dirección de entrega.",

      saveError: "No se pudo guardar la dirección.",

      loadError: "No fue posible cargar la dirección.",

      notFound: "La dirección no fue encontrada.",
    },

    common: {
      accept: "Aceptar",
      reject: "Rechazar",
      back: "Volver",
      loading: "Cargando...",
      error: "Error",
      address: "Dirección",
    },

    movePinHelper: "Mueve el pin para ajustar la ubicación exacta.",

    updatingAddress: "Actualizando dirección...",

    orderStatus: {
      validation: "Validando",
      quoted: "Cotización lista",
      accepted: "Aceptado",
      inProgress: "Preparando pedido",
      onRoute: "En camino",
      delivered: "Entregado",
      rejected: "Rechazado",
      cancelled: "Cancelado",
    },
  },

  en: {
    home: {
      title: "Boomerang",
      slogan: "Whatever you need, just ask.",
      description: "Tell us what you need and we'll take care of it.",
      question: "What do you need today?",

      supermarket: "Supermarket",
      restaurant: "Restaurant",
      pharmacy: "Pharmacy",
      messaging: "Courier",

      makeOrder: "Place order",
    },

    bottomNavigation: {
      home: "Home",
      orders: "Orders",
      create: "New",
      profile: "Profile",
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
      requiredMessage: "Please enter email and password.",
      errorTitle: "Login Error",
    },

    register: {
      title: "Create Account",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      button: "Create Account",
      subtitle: "Register to place orders and track your deliveries.",
      requiredTitle: "Required Fields",
      requiredMessage: "Please enter email and password.",
      errorTitle: "Registration Error",
      successTitle: "Registration Successful",
      successMessage: "User created successfully.",
      registerButton: "Register",
      registering: "Creating account...",
      backHome: "Back to Home",
      fullName: "Full name",
      phone: "Phone number",
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
      myAddressSubtitle: "Manage your delivery address",

      aboutApp: "About the App",
      aboutAppSubtitle: "Information, terms, and version",

      contactSupport: "Contact Customer Support",
      contactSupportSubtitle: "We are here to help",
    },

    addresses: {
      title: "My Addresses",
      subtitle: "Manage your delivery address.",
      loading: "Loading address...",
      loadError: "We could not load your address.",
      errorTitle: "Something went wrong",
      retry: "Try Again",
      emptyTitle: "You do not have a saved address",
      emptyDescription: "Add an address so you can place your orders.",
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
      placeholder: "What do you need us to bring?",
      button: "Submit Order",
      successTitle: "Order Created",
      successMessage: "Your order was submitted successfully.",
      errorTitle: "Error",
      errorMessage: "The order could not be created.",
      subtitle: "Tell us what you need and we will take care of it.",
      question: "What do you need?",
      required: "Please enter your order.",
      optionalDetails: "Optional Details",
      referencePhoto: "Reference Photo",
      deliveryAddress: "Delivery Address",
      additionalNotes: "Additional Notes",
      creating: "Creating...",
      selectAddress: "Select an address.",
      selectService: "Select a service type.",
      moreDetail: "Please provide more details about the order.",
      noAddresses: "You do not have any saved addresses yet.",
      serviceType: "Service Type",
      supermarket: "Supermarket",
      pharmacy: "Pharmacy",
      foodPickup: "Restaurant",
      messaging: "Courier",

      courierWeightTitle: "Approximate weight",

      courierLightTitle: "Light (0–4.4 lb)",
      courierLightDescription:
        "Documents, medications, keys, or small packages.",

      courierMediumTitle: "Medium (4.4–22 lb)",
      courierMediumDescription:
        "Small grocery orders, boxes, or small appliances.",

      courierHeavyTitle: "Heavy (22–55 lb)",
      courierHeavyDescription: "Large boxes, coolers, or pet food bags.",

      courierManualReview:
        "If the package weighs more than 55 lb or is too bulky, the quote will require manual review.",

      estimatedPurchaseTitle: "Estimated purchase amount",
      estimatedPurchaseApproximately: "Approximately",

      estimatedPurchaseHelper:
        "Move the slider to select an approximate amount. The final amount will be confirmed using the store receipt.",

      estimatedPurchaseAccessibility: "Estimated purchase amount",

      foodPaymentTitle: "Has the food order already been paid?",

      foodPaymentYes: "Yes, it has already been paid",

      foodPaymentYesDescription:
        "The driver will only pick up and deliver the order.",

      foodPaymentNo: "No, it still needs to be paid",

      foodPaymentNoDescription:
        "The driver will need to pay for the order when picking it up.",

      foodPaymentRequired:
        "Please indicate whether the food order has already been paid.",

      estimatedPurchaseValidationHelper:
        "Select an approximate amount to validate that the purchase is within the permitted limit.",

      estimatedPurchaseSeparateCharge:
        "This amount is not part of the delivery service fee. The purchase is paid separately according to the merchant invoice.",

      minimumPurchaseAmount: "Minimum",
      maximumPurchaseAmount: "Maximum",

      purchaseAmountOutOfRange:
        "The estimated amount is outside the allowed range.",

      comingSoon: "Coming Soon",

      addAddress: "Add address",

      pickupLocation: "Pickup location",

      preferredSupermarket: "Preferred supermarket",
      preferredSupermarketPlaceholder:
        "Example: Super Compro, Maxi Palí, Automercado",

      preferredPharmacy: "Preferred pharmacy",
      preferredPharmacyPlaceholder: "Example: Farmacia La Bomba, Fischel",

      restaurantPickupPlaceholder: "Example: El Tiki Restaurant, Flamingo",

      messagingPickupPlaceholder:
        "Example: Hotel, store, house, or pickup point",

      pickupLocationRequired: "Please enter the pickup location.",
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

      acceptedMessage: "Your order was confirmed.",
      rejectedMessage: "This order was cancelled.",
      processingMessage: "We are processing your request.",

      backHome: "Back to Home",
      backOrders: "Back to My Orders",
      currentStatus: "Current Status",

      quoteAcceptedTitle: "Quote Accepted",
      quoteAcceptedMessage: "Your order was accepted successfully.",
      quoteRejectedTitle: "Quote Rejected",
      quoteRejectedMessage: "You rejected this quote.",

      acceptError: "The quote could not be accepted.",
      rejectError: "The quote could not be rejected.",
      notFound: "Order not found.",

      trackingTitle: "Delivery tracking",
      trackingDelivered: "Your order was delivered",
      trackingLive: "Location updates in real time",
      trackingWaiting: "Available when the driver starts the delivery",
      trackingUnavailable: "Tracking is unavailable for this order",
      updatedRecently: "Updated recently",
      notAvailable: "Not available yet",

      yourDriver: "Your driver",
      driverOnTheWay: "On the way to your address",
      driverNotStarted: "The delivery has not started yet",

      yourAddress: "Your address",

      estimatedArrival: "Estimated arrival",
      estimatedMinutes: "12–18 min",
      pendingEstimate: "Pending",

      deliveryStatus: "Delivery status",
      delivered: "Delivered",
      onTheWay: "On the way",
      preparing: "Preparing order",

      showPriceDetail: "Show details",
      hidePriceDetail: "Hide details",
    },

    addressForm: {
      title: "My Address",
      editTitle: "Edit Address",

      subtitle:
        "Register a single address to receive your orders during the beta.",

      automaticSubtitle:
        "We'll use your current location to automatically detect your address. You only need to add extra delivery instructions if you'd like.",

      labelName: "Address Name",
      address: "Address",
      reference: "Additional Reference",

      detectedLocation: "Detected Location",

      locationReady: "Your location has been successfully detected.",

      locationWaiting: "Waiting to detect your location.",

      detectingLocation: "Detecting location...",

      noLocationDetected: "No location has been detected yet.",

      detectLocation: "Detect Location",

      updateLocation: "Update Location",

      additionalNotes: "Additional Instructions",

      additionalNotesPlaceholder:
        "Example: White house, black gate, second floor, across from the supermarket...",

      placeholderLabel: "Home, Work, Apartment...",

      placeholderAddress: "Example: 200m north of the supermarket...",

      placeholderReference:
        "Gate color, nearby landmark, delivery instructions...",

      save: "Save Address",

      update: "Update Address",

      saving: "Saving...",

      loading: "Loading address...",

      savedTitle: "Address Saved",

      savedMessage: "Your address has been saved successfully.",

      updatedMessage: "Your address has been updated successfully.",

      locationPermissionTitle: "Location Permission",

      locationPermissionMessage:
        "We need access to your location to automatically detect your address.",

      locationDetectedTitle: "Location Detected",

      addressUnavailable:
        "We couldn't determine an exact address. Your coordinates will be saved instead.",

      locationError: "We couldn't retrieve your current location.",

      locationRequired: "Please detect your location first.",

      nameRequired: "Please enter a name for this address.",

      addressRequired: "Please enter your delivery address.",

      saveError: "Unable to save the address.",

      loadError: "Unable to load the address.",

      notFound: "Address not found.",
    },

    common: {
      accept: "Accept",
      reject: "Reject",
      back: "Back",
      loading: "Loading...",
      error: "Error",
      address: "Address",
    },

    movePinHelper: "Move the pin to adjust the exact location.",

    updatingAddress: "Updating address...",

    orderStatus: {
      validation: "Validating",
      quoted: "Quote ready",
      accepted: "Accepted",
      inProgress: "Preparing order",
      onRoute: "On the way",
      delivered: "Delivered",
      rejected: "Rejected",
      cancelled: "Cancelled",
    },
  },
};

export type Language = keyof typeof translations;
