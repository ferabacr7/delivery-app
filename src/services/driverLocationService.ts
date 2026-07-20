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
    activeDeliveryId === deliveryId
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

  if (activeLocationSubscription) {
    if (activeDeliveryId === normalizedDeliveryId) {
      console.warn(
        "DRIVER TRACKING: Tracking is already active for this delivery",
      );

      return activeLocationSubscription;
    }

    throw new Error(
      `Tracking is already active for delivery ${activeDeliveryId}`,
    );
  }

  await requestLocationPermission();

  console.log(
    "DRIVER TRACKING: Starting location tracking",
    normalizedDeliveryId,
  );

  activeDeliveryId = normalizedDeliveryId;

  try {
    activeLocationSubscription =
      await watchCurrentLocation(async (location) => {
        if (isSavingLocation) {
          console.warn(
            "DRIVER TRACKING: Previous location is still being saved",
          );

          return;
        }

        isSavingLocation = true;

        try {
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
          isSavingLocation = false;
        }
      });

    return activeLocationSubscription;
  } catch (error) {
    activeLocationSubscription = null;
    activeDeliveryId = null;
    isSavingLocation = false;

    throw error;
  }
}

export function stopDriverLocationTracking(): void {
  if (!activeLocationSubscription) {
    console.log(
      "DRIVER TRACKING: No active tracking subscription",
    );

    activeDeliveryId = null;
    isSavingLocation = false;

    return;
  }

  stopWatchingLocation(activeLocationSubscription);

  activeLocationSubscription = null;
  activeDeliveryId = null;
  isSavingLocation = false;

  console.log(
    "DRIVER TRACKING: Tracking stopped",
  );
}