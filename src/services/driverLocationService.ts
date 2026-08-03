import type { LocationSubscription } from "expo-location";

import {
  requestLocationPermission,
  stopWatchingLocation,
  watchCurrentLocation,
} from "./locationService";

import { insertTrackingLocation } from "./trackingService";

let activeLocationSubscription: LocationSubscription | null =
  null;

let activeDeliveryId: string | null = null;

let isSavingLocation = false;

/*
 * Identifica la sesión actual de tracking.
 *
 * Cada vez que iniciamos o detenemos tracking,
 * cambia este número.
 *
 * Esto evita que callbacks antiguos continúen
 * comportándose como si todavía fueran válidos.
 */
let trackingSessionId = 0;

export function isDriverTrackingActive(): boolean {
  return activeLocationSubscription !== null;
}

export function getActiveTrackingDeliveryId(): string | null {
  return activeDeliveryId;
}

export function isTrackingDelivery(
  deliveryId: string,
): boolean {
  return (
    activeLocationSubscription !== null &&
    activeDeliveryId === deliveryId.trim()
  );
}

export async function startDriverLocationTracking(
  deliveryId: string,
): Promise<LocationSubscription> {
  const normalizedDeliveryId = deliveryId.trim();

  if (!normalizedDeliveryId) {
    throw new Error(
      "A valid deliveryId is required to start tracking",
    );
  }

  /*
   * Si ya estamos transmitiendo exactamente
   * esta entrega, no creamos otra suscripción.
   */
  if (
    activeLocationSubscription &&
    activeDeliveryId === normalizedDeliveryId
  ) {
    console.log(
      "DRIVER TRACKING: Tracking already active for this delivery",
    );

    return activeLocationSubscription;
  }

  /*
   * Solo permitimos una entrega transmitiendo
   * ubicación por dispositivo.
   *
   * Si quedó una suscripción anterior activa,
   * la limpiamos antes de iniciar la nueva.
   */
  if (activeLocationSubscription) {
    console.warn(
      "DRIVER TRACKING: Replacing previous tracking session",
      {
        previousDeliveryId: activeDeliveryId,
        nextDeliveryId: normalizedDeliveryId,
      },
    );

    stopDriverLocationTracking();
  }

  await requestLocationPermission();

  console.log(
    "DRIVER TRACKING: Starting location tracking",
    normalizedDeliveryId,
  );

  const currentSessionId = ++trackingSessionId;

  activeDeliveryId = normalizedDeliveryId;
  isSavingLocation = false;

  try {
    const subscription = await watchCurrentLocation(
      async (location) => {
        /*
         * Ignorar callbacks pertenecientes
         * a una sesión que ya fue cerrada.
         */
        if (
          currentSessionId !== trackingSessionId ||
          activeDeliveryId !== normalizedDeliveryId
        ) {
          return;
        }

        /*
         * Si todavía estamos guardando el punto
         * anterior, descartamos este punto.
         *
         * Esto evita escrituras simultáneas
         * innecesarias en Supabase.
         */
        if (isSavingLocation) {
          return;
        }

        isSavingLocation = true;

        try {
          /*
           * Volvemos a comprobar la sesión antes
           * de escribir.
           */
          if (
            currentSessionId !== trackingSessionId ||
            activeDeliveryId !== normalizedDeliveryId
          ) {
            return;
          }

          await insertTrackingLocation({
            deliveryId: normalizedDeliveryId,
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading,
            speed: location.speed,
            accuracy: location.accuracy,
          });

          console.log(
            "DRIVER TRACKING LOCATION SAVED:",
            {
              deliveryId: normalizedDeliveryId,
              ...location,
            },
          );
        } catch (error) {
          console.error(
            "DRIVER TRACKING INSERT ERROR:",
            error,
          );
        } finally {
          /*
           * Solo la sesión actual puede modificar
           * este estado.
           */
          if (currentSessionId === trackingSessionId) {
            isSavingLocation = false;
          }
        }
      },
    );

    /*
     * Es posible que la sesión haya sido detenida
     * mientras Expo estaba creando la suscripción.
     */
    if (currentSessionId !== trackingSessionId) {
      stopWatchingLocation(subscription);

      throw new Error(
        "Tracking session was cancelled before it could start.",
      );
    }

    activeLocationSubscription = subscription;

    return subscription;
  } catch (error) {
    if (currentSessionId === trackingSessionId) {
      activeLocationSubscription = null;
      activeDeliveryId = null;
      isSavingLocation = false;

      trackingSessionId += 1;
    }

    throw error;
  }
}

export function stopDriverLocationTracking(): void {
  /*
   * Invalidamos primero todos los callbacks
   * pertenecientes a la sesión anterior.
   */
  trackingSessionId += 1;

  const subscription = activeLocationSubscription;

  activeLocationSubscription = null;
  activeDeliveryId = null;
  isSavingLocation = false;

  if (!subscription) {
    console.log(
      "DRIVER TRACKING: No active tracking subscription",
    );

    return;
  }

  stopWatchingLocation(subscription);

  console.log(
    "DRIVER TRACKING: Tracking stopped",
  );
}