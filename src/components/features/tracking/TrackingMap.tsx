import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { colors, radius, spacing, typography } from "../../../constants/theme";

import type { DeliveryTrackingLocation } from "../../../hooks/useDeliveryTracking";

type TrackingMapProps = {
  deliveryId?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  location?: DeliveryTrackingLocation | null;

  history?: DeliveryTrackingLocation[];
};

const DEFAULT_LATITUDE = 10.4239;
const DEFAULT_LONGITUDE = -85.7937;

/*
 * Calcula el destino angular más corto.
 *
 * Ejemplos:
 * 350° → 10° = 350° → 370°
 * 10° → 350° = 10° → -10°
 */
function getShortestHeadingTarget(
  currentHeading: number,
  nextHeading: number,
) {
  const difference =
    ((nextHeading - currentHeading + 540) % 360) - 180;

  return currentHeading + difference;
}

export default function TrackingMap({
  deliveryId,
  latitude,
  longitude,
  location,
  history = [],
}: TrackingMapProps) {
  const mapRef = useRef<MapView>(null);

  const hasAdjustedMap = useRef(false);

  const destinationLatitude =
    latitude ?? DEFAULT_LATITUDE;

  const destinationLongitude =
    longitude ?? DEFAULT_LONGITUDE;

  const activeLocation = location;

  const driverLatitude =
    activeLocation?.latitude ??
    destinationLatitude - 0.0015;

  const driverLongitude =
    activeLocation?.longitude ??
    destinationLongitude - 0.0015;

  const driverHeading =
    activeLocation?.heading ?? 0;

  /*
   * Convierte el historial de tracking
   * al formato esperado por Polyline.
   */
  const routeCoordinates = history.map((point) => ({
    latitude: point.latitude,
    longitude: point.longitude,
  }));

  /*
   * Movimiento animado del repartidor.
   */
  const animatedLatitude = useRef(
    new Animated.Value(driverLatitude),
  ).current;

  const animatedLongitude = useRef(
    new Animated.Value(driverLongitude),
  ).current;

  const [animatedDriverLocation, setAnimatedDriverLocation] =
    useState({
      latitude: driverLatitude,
      longitude: driverLongitude,
    });

  /*
   * Heading animado.
   */
  const animatedHeading = useRef(
    new Animated.Value(driverHeading),
  ).current;

  const currentHeadingRef =
    useRef(driverHeading);

  const [displayHeading, setDisplayHeading] =
    useState(driverHeading);

  /*
   * Al cambiar de delivery reiniciamos
   * el ajuste inicial del mapa.
   */
  useEffect(() => {
    hasAdjustedMap.current = false;
  }, [deliveryId]);

  /*
   * Escucha latitude/longitude animados
   * y actualiza la coordenada visible.
   */
  useEffect(() => {
    const latitudeListener =
      animatedLatitude.addListener(({ value }) => {
        setAnimatedDriverLocation((current) => ({
          ...current,
          latitude: value,
        }));
      });

    const longitudeListener =
      animatedLongitude.addListener(({ value }) => {
        setAnimatedDriverLocation((current) => ({
          ...current,
          longitude: value,
        }));
      });

    return () => {
      animatedLatitude.removeListener(
        latitudeListener,
      );

      animatedLongitude.removeListener(
        longitudeListener,
      );
    };
  }, [
    animatedLatitude,
    animatedLongitude,
  ]);

  /*
   * Anima el movimiento del repartidor.
   */
  useEffect(() => {
    if (!activeLocation) {
      return;
    }

    animatedLatitude.stopAnimation();
    animatedLongitude.stopAnimation();

    Animated.parallel([
      Animated.timing(animatedLatitude, {
        toValue: driverLatitude,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      }),

      Animated.timing(animatedLongitude, {
        toValue: driverLongitude,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();
  }, [
    activeLocation,
    animatedLatitude,
    animatedLongitude,
    driverLatitude,
    driverLongitude,
  ]);

  /*
   * Escucha el heading animado.
   */
  useEffect(() => {
    const headingListener =
      animatedHeading.addListener(({ value }) => {
        currentHeadingRef.current = value;
        setDisplayHeading(value);
      });

    return () => {
      animatedHeading.removeListener(
        headingListener,
      );
    };
  }, [animatedHeading]);

  /*
   * Anima el heading utilizando siempre
   * el giro más corto posible.
   */
  useEffect(() => {
    const nextHeading =
      activeLocation?.heading;

    if (
      nextHeading === null ||
      nextHeading === undefined
    ) {
      return;
    }

    const currentHeading =
      currentHeadingRef.current;

    const targetHeading =
      getShortestHeadingTarget(
        currentHeading,
        nextHeading,
      );

    animatedHeading.stopAnimation();

    Animated.timing(animatedHeading, {
      toValue: targetHeading,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [
    activeLocation?.heading,
    animatedHeading,
  ]);

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
            (destinationLatitude +
              driverLatitude) /
            2,
          longitude:
            (destinationLongitude +
              driverLongitude) /
            2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {routeCoordinates.length >= 2 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.brand}
            strokeWidth={5}
          />
        )}

        <Marker
          coordinate={animatedDriverLocation}
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
                      rotate: `${displayHeading}deg`,
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
            longitude:
              destinationLongitude,
          }}
          anchor={{
            x: 0.5,
            y: 0.5,
          }}
        >
          <View style={styles.markerWrapper}>
            <View
              style={
                styles.destinationMarker
              }
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
    backgroundColor: colors.surfaceSoft,
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
    backgroundColor: colors.brandDark,
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