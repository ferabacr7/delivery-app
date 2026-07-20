import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
} from "react-native-maps";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../../constants/theme";
import {
  getLatestTrackingLocation,
  subscribeToTrackingLocation,
  unsubscribeFromTrackingLocation,
} from "../../../services/trackingService";

type TrackingMapProps = {
  deliveryId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type DriverLocation = {
  latitude: number;
  longitude: number;
  heading: number | null;
};

const DEFAULT_LATITUDE = 10.4239;
const DEFAULT_LONGITUDE = -85.7937;

function normalizeHeading(
  heading: number | null | undefined,
): number | null {
  if (
    heading === null ||
    heading === undefined ||
    !Number.isFinite(heading) ||
    heading < 0
  ) {
    return null;
  }

  return heading % 360;
}

export default function TrackingMap({
  deliveryId,
  latitude,
  longitude,
}: TrackingMapProps) {
  const mapRef = useRef<MapView>(null);

  const hasAdjustedMap = useRef(false);

  const [driverLocation, setDriverLocation] =
    useState<DriverLocation | null>(null);

  const destinationLatitude =
    latitude ?? DEFAULT_LATITUDE;

  const destinationLongitude =
    longitude ?? DEFAULT_LONGITUDE;

  const driverLatitude =
    driverLocation?.latitude ??
    destinationLatitude - 0.0015;

  const driverLongitude =
    driverLocation?.longitude ??
    destinationLongitude - 0.0015;

  const driverHeading =
    driverLocation?.heading ?? 0;

  /*
   * Cuando cambia la entrega:
   * - reinicia la ubicación;
   * - permite volver a ajustar el mapa.
   */
  useEffect(() => {
    hasAdjustedMap.current = false;
    setDriverLocation(null);
  }, [deliveryId]);

  /*
   * Obtiene la última ubicación conocida
   * al abrir el mapa.
   */
  useEffect(() => {
    if (!deliveryId) {
      console.warn(
        "TRACKING MAP: No se recibió un deliveryId válido.",
      );

      return;
    }

    const validDeliveryId = deliveryId;

    let isMounted = true;

    async function loadLatestTrackingLocation() {
      try {
        const { data, error } =
          await getLatestTrackingLocation(
            validDeliveryId,
          );

        if (error) {
          throw error;
        }

        if (!data || !isMounted) {
          return;
        }

        const parsedLatitude = Number(
          data.latitude,
        );

        const parsedLongitude = Number(
          data.longitude,
        );

        const parsedHeading =
          data.heading === null
            ? null
            : Number(data.heading);

        if (
          !Number.isFinite(parsedLatitude) ||
          !Number.isFinite(parsedLongitude)
        ) {
          throw new Error(
            "La ubicación recibida desde Supabase no es válida.",
          );
        }

        setDriverLocation({
          latitude: parsedLatitude,
          longitude: parsedLongitude,
          heading: normalizeHeading(
            parsedHeading,
          ),
        });

        console.log(
          "LATEST TRACKING LOCATION:",
          data,
        );
      } catch (error) {
        console.error(
          "LOAD TRACKING LOCATION ERROR:",
          error,
        );
      }
    }

    void loadLatestTrackingLocation();

    return () => {
      isMounted = false;
    };
  }, [deliveryId]);

  /*
   * Escucha nuevas ubicaciones mediante
   * Supabase Realtime.
   */
  useEffect(() => {
    if (!deliveryId) {
      return;
    }

    const validDeliveryId = deliveryId;

    const channel =
      subscribeToTrackingLocation(
        validDeliveryId,
        (newLocation) => {
          const newLatitude = Number(
            newLocation.latitude,
          );

          const newLongitude = Number(
            newLocation.longitude,
          );

          const rawHeading =
            newLocation.heading === null
              ? null
              : Number(newLocation.heading);

          if (
            !Number.isFinite(newLatitude) ||
            !Number.isFinite(newLongitude)
          ) {
            console.warn(
              "REALTIME TRACKING LOCATION INVALID:",
              newLocation,
            );

            return;
          }

          const normalizedHeading =
            normalizeHeading(rawHeading);

          console.log(
            "REALTIME TRACKING LOCATION:",
            newLocation,
          );

          console.log(
            "DRIVER HEADING:",
            normalizedHeading,
          );

          setDriverLocation(
            (currentLocation) => ({
              latitude: newLatitude,
              longitude: newLongitude,

              /*
               * Si iOS devuelve -1 o null,
               * conservamos el último rumbo válido.
               */
              heading:
                normalizedHeading ??
                currentLocation?.heading ??
                null,
            }),
          );
        },
      );

    return () => {
      void unsubscribeFromTrackingLocation(
        channel,
      );
    };
  }, [deliveryId]);

  /*
   * Ajusta el mapa una sola vez por entrega.
   */
  useEffect(() => {
    if (hasAdjustedMap.current) {
      return;
    }

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [
          {
            latitude: driverLatitude,
            longitude: driverLongitude,
          },
          {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },
        ],
        {
          edgePadding: {
            top: 80,
            right: 80,
            bottom: 80,
            left: 80,
          },
          animated: true,
        },
      );

      hasAdjustedMap.current = true;
    }, 350);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    driverLatitude,
    driverLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsCompass={false}
        showsTraffic
        showsBuildings
        toolbarEnabled={false}
        showsUserLocation={false}
        initialRegion={{
          latitude:
            (
              destinationLatitude +
              driverLatitude
            ) / 2,
          longitude:
            (
              destinationLongitude +
              driverLongitude
            ) / 2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polyline
          coordinates={[
            {
              latitude: driverLatitude,
              longitude: driverLongitude,
            },
            {
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            },
          ]}
          strokeColor={colors.brand}
          strokeWidth={5}
          lineDashPattern={[1]}
        />

        <Marker
          coordinate={{
            latitude: driverLatitude,
            longitude: driverLongitude,
          }}
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
        >
          <View style={styles.markerWrapper}>
            <View style={styles.driverMarker}>
              <View
                style={{
                  transform: [
                    {
                      rotate: `${driverHeading}deg`,
                    },
                  ],
                }}
              >
                <Ionicons
                  name="bicycle"
                  size={24}
                  color={colors.textInverse}
                />
              </View>
            </View>

            <Text style={styles.markerLabel}>
              Repartidor
            </Text>
          </View>
        </Marker>

        <Marker
          coordinate={{
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          }}
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
        >
          <View style={styles.markerWrapper}>
            <View
              style={styles.destinationMarker}
            >
              <Ionicons
                name="home"
                size={22}
                color={colors.textInverse}
              />
            </View>

            <Text style={styles.markerLabel}>
              Tu dirección
            </Text>
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 320,
    overflow: "hidden",
    borderRadius: radius.xl,
    backgroundColor:
      colors.surfaceSoft,
  },

  map: {
    flex: 1,
  },

  markerWrapper: {
    alignItems: "center",
  },

  driverMarker: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.brand,
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },

  destinationMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:
      colors.brandDark,
    borderWidth: 4,
    borderColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
  },

  markerLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    color: colors.text,
    fontWeight: "800",
    overflow: "hidden",
  },
});