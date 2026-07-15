import * as Location from "expo-location";

export async function requestLocationPermission() {
  const { status } =
    await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission not granted");
  }

  return true;
}

export async function getCurrentLocation() {
  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    heading: location.coords.heading,
    speed: location.coords.speed,
    accuracy: location.coords.accuracy,
  };
}