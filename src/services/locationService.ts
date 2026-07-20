import * as Location from "expo-location";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
};

type LocationChangeCallback = (
  location: DeviceLocation,
) => void;

function mapExpoLocation(
  location: Location.LocationObject,
): DeviceLocation {
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    heading: location.coords.heading,
    speed: location.coords.speed,
    accuracy: location.coords.accuracy,
  };
}

export async function requestLocationPermission() {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  return true;
}

export async function getCurrentLocation(): Promise<DeviceLocation> {
  const location =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  return mapExpoLocation(location);
}

export async function watchCurrentLocation(
  onLocationChange: LocationChangeCallback,
) {
  const subscription =
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      (location) => {
        onLocationChange(
          mapExpoLocation(location),
        );
      },
    );

  return subscription;
}

export function stopWatchingLocation(
  subscription: Location.LocationSubscription,
) {
  subscription.remove();
}