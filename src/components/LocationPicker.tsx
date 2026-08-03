import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, {
  Marker,
  Region,
} from "react-native-maps";

import { useTranslation } from "../i18n/useTranslation";
import { colors } from "../styles/theme";

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  addressLine: string;
};

type LocationPickerProps = {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  initialAddressLine?: string;
  onLocationChange: (
    location: SelectedLocation,
  ) => void;
};

const DEFAULT_LATITUDE = 10.4239;
const DEFAULT_LONGITUDE = -85.7937;

const DEFAULT_REGION: Region = {
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function LocationPicker({
  initialLatitude,
  initialLongitude,
  initialAddressLine = "",
  onLocationChange,
}: LocationPickerProps) {
  const mapRef = useRef<MapView>(null);
  const hasAutoDetectedRef = useRef(false);

  const hasInitialCoordinates =
    typeof initialLatitude === "number" &&
    typeof initialLongitude === "number";

  const [coordinates, setCoordinates] = useState({
    latitude:
      initialLatitude ?? DEFAULT_LATITUDE,
    longitude:
      initialLongitude ?? DEFAULT_LONGITUDE,
  });

  const [addressLine, setAddressLine] = useState(
    initialAddressLine,
  );

  const [isDetecting, setIsDetecting] =
    useState(false);

  const [isResolvingAddress, setIsResolvingAddress] =
    useState(false);

  const [hasLocation, setHasLocation] = useState(
    hasInitialCoordinates,
  );

  const { t } = useTranslation();

  useEffect(() => {
    if (
      typeof initialLatitude === "number" &&
      typeof initialLongitude === "number"
    ) {
      const initialCoordinates = {
        latitude: initialLatitude,
        longitude: initialLongitude,
      };

      setCoordinates(initialCoordinates);
      setAddressLine(initialAddressLine);
      setHasLocation(true);

      mapRef.current?.animateToRegion(
        {
          ...initialCoordinates,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        },
        500,
      );
    }
  }, [
    initialAddressLine,
    initialLatitude,
    initialLongitude,
  ]);

  useEffect(() => {
    if (
      hasInitialCoordinates ||
      hasAutoDetectedRef.current
    ) {
      return;
    }

    hasAutoDetectedRef.current = true;

    detectCurrentLocation();
  }, [hasInitialCoordinates]);

  async function detectCurrentLocation() {
    if (isDetecting) {
      return;
    }

    try {
      setIsDetecting(true);

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          t("addressForm.locationPermissionTitle"),
          t("addressForm.locationPermissionMessage"),
        );

        return;
      }

      if (Platform.OS === "android") {
        try {
          await Location.enableNetworkProviderAsync();
        } catch (error) {
          console.warn(
            "Could not enable high accuracy location:",
            error,
          );
        }
      }

      const currentPosition =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const newCoordinates = {
        latitude:
          currentPosition.coords.latitude,
        longitude:
          currentPosition.coords.longitude,
      };

      setCoordinates(newCoordinates);
      setHasLocation(true);

      mapRef.current?.animateToRegion(
        {
          ...newCoordinates,
          latitudeDelta: 0.006,
          longitudeDelta: 0.006,
        },
        700,
      );

      await resolveAddress(newCoordinates);
    } catch (error) {
      console.error(
        "Error detecting current location:",
        error,
      );

      Alert.alert(
        t("common.error"),
        t("addressForm.locationError"),
      );
    } finally {
      setIsDetecting(false);
    }
  }

  async function resolveAddress(location: {
    latitude: number;
    longitude: number;
  }) {
    try {
      setIsResolvingAddress(true);

      const results =
        await Location.reverseGeocodeAsync(location);

      const detectedAddress = results[0];

      const formattedAddress = detectedAddress
        ? formatDetectedAddress(detectedAddress)
        : `${location.latitude.toFixed(
            6,
          )}, ${location.longitude.toFixed(6)}`;

      setAddressLine(formattedAddress);

      onLocationChange({
        latitude: location.latitude,
        longitude: location.longitude,
        addressLine: formattedAddress,
      });
    } catch (error) {
      console.error(
        "Error resolving address:",
        error,
      );

      const coordinateAddress =
        `${location.latitude.toFixed(6)}, ` +
        `${location.longitude.toFixed(6)}`;

      setAddressLine(coordinateAddress);

      onLocationChange({
        latitude: location.latitude,
        longitude: location.longitude,
        addressLine: coordinateAddress,
      });
    } finally {
      setIsResolvingAddress(false);
    }
  }

  function formatDetectedAddress(
    address: Location.LocationGeocodedAddress,
  ) {
    const possibleParts = [
      address.name,
      address.street,
      address.district,
      address.city,
      address.subregion,
      address.region,
      address.postalCode,
      address.country,
    ];

    const uniqueParts: string[] = [];

    possibleParts.forEach((part) => {
      const normalizedPart = part?.trim();

      if (
        normalizedPart &&
        !uniqueParts.some(
          (existingPart) =>
            existingPart.toLowerCase() ===
            normalizedPart.toLowerCase(),
        )
      ) {
        uniqueParts.push(normalizedPart);
      }
    });

    return uniqueParts.join(", ");
  }

  async function handleMarkerDragEnd(
    latitude: number,
    longitude: number,
  ) {
    const newCoordinates = {
      latitude,
      longitude,
    };

    setCoordinates(newCoordinates);
    setHasLocation(true);

    await resolveAddress(newCoordinates);
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={
            hasLocation
              ? {
                  ...coordinates,
                  latitudeDelta: 0.006,
                  longitudeDelta: 0.006,
                }
              : DEFAULT_REGION
          }
          showsUserLocation
          showsMyLocationButton={false}
        >
          {hasLocation ? (
            <Marker
              coordinate={coordinates}
              draggable
              onDragEnd={(event) => {
                const {
                  latitude,
                  longitude,
                } = event.nativeEvent.coordinate;

                handleMarkerDragEnd(
                  latitude,
                  longitude,
                );
              }}
            />
          ) : null}
        </MapView>

        {isDetecting || isResolvingAddress ? (
          <View style={styles.mapLoadingOverlay}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />

            <Text style={styles.loadingText}>
              {isDetecting
                ? t(
                    "addressForm.detectingLocation",
                  )
                : t(
                    "addressForm.updatingAddress",
                  )}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.addressContainer}>
        <Ionicons
          name="navigate-outline"
          size={19}
          color={colors.primary}
        />

        <Text style={styles.addressText}>
          {addressLine ||
            t(
              "addressForm.noLocationDetected",
            )}
        </Text>
      </View>

      <Pressable
        style={[
          styles.locationButton,
          isDetecting &&
            styles.locationButtonDisabled,
        ]}
        onPress={detectCurrentLocation}
        disabled={
          isDetecting || isResolvingAddress
        }
      >
        {isDetecting ? (
          <ActivityIndicator
            size="small"
            color={colors.primary}
          />
        ) : (
          <Ionicons
            name="locate-outline"
            size={20}
            color={colors.primary}
          />
        )}

        <Text style={styles.locationButtonText}>
          {hasLocation
            ? t("addressForm.updateLocation")
            : t("addressForm.detectLocation")}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  mapContainer: {
    height: 260,
    overflow: "hidden",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F3F4F6",
  },

  map: {
    flex: 1,
  },

  mapLoadingOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },

  loadingText: {
    marginLeft: 9,
    fontSize: 13,
    fontWeight: "700",
    color: colors.dark,
  },

  addressContainer: {
    marginTop: 14,
    padding: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.brandSoft,
  },

  addressText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: colors.dark,
  },

  locationButton: {
    height: 50,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  locationButtonDisabled: {
    opacity: 0.6,
  },

  locationButtonText: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.primary,
  },
});