import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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

import type { DeliveryTrackingLocation } from "../../../hooks/useDeliveryTracking";

import { useTranslation } from "../../../i18n/useTranslation";

import {
  decodeGooglePolyline,
  getRoute,
  type RouteCoordinates,
} from "../../../services/routeService";

type TrackingMapProps = {
  deliveryId?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  location?: DeliveryTrackingLocation | null;

  history?: DeliveryTrackingLocation[];

  onEtaChange?: (
    minutes: number | null,
  ) => void;
};

const DEFAULT_LATITUDE = 10.4239;
const DEFAULT_LONGITUDE = -85.7937;

/*
 * Intervalo mínimo entre recálculos
 * de Google Routes.
 *
 * La primera ruta se solicita
 * inmediatamente.
 */
const ROUTE_REFRESH_INTERVAL_MS = 15000;

export default function TrackingMap({
  deliveryId,
  latitude,
  longitude,
  location,
  onEtaChange,
}: TrackingMapProps) {
  const { t } = useTranslation();

  const mapRef =
    useRef<MapView>(null);

  const hasAdjustedMap =
    useRef(false);

  const lastRouteRequestAt =
    useRef(0);

  const destinationLatitude =
    latitude ??
    DEFAULT_LATITUDE;

  const destinationLongitude =
    longitude ??
    DEFAULT_LONGITUDE;

  const activeLocation =
    location;

  const driverLatitude =
    activeLocation?.latitude ??
    destinationLatitude - 0.0015;

  const driverLongitude =
    activeLocation?.longitude ??
    destinationLongitude - 0.0015;

  /*
   * Ruta real obtenida desde
   * Google Routes.
   */
  const [
    googleRouteCoordinates,
    setGoogleRouteCoordinates,
  ] = useState<RouteCoordinates[]>([]);

  /*
   * Movimiento animado del pedido.
   */
  const animatedLatitude =
    useRef(
      new Animated.Value(
        driverLatitude,
      ),
    ).current;

  const animatedLongitude =
    useRef(
      new Animated.Value(
        driverLongitude,
      ),
    ).current;

  const [
    animatedDriverLocation,
    setAnimatedDriverLocation,
  ] = useState({
    latitude:
      driverLatitude,

    longitude:
      driverLongitude,
  });

  /*
   * Al cambiar de delivery:
   *
   * - reiniciamos el ajuste del mapa;
   * - eliminamos la ruta anterior;
   * - limpiamos el ETA anterior;
   * - permitimos pedir inmediatamente
   *   una ruta nueva.
   */
  useEffect(() => {
    hasAdjustedMap.current =
      false;

    lastRouteRequestAt.current =
      0;

    setGoogleRouteCoordinates(
      [],
    );

    onEtaChange?.(
      null,
    );
  }, [
    deliveryId,
    onEtaChange,
  ]);

  /*
   * Escucha latitude/longitude animados
   * y actualiza la coordenada visible.
   */
  useEffect(() => {
    const latitudeListener =
      animatedLatitude.addListener(
        ({
          value,
        }) => {
          setAnimatedDriverLocation(
            (
              current,
            ) => ({
              ...current,

              latitude:
                value,
            }),
          );
        },
      );

    const longitudeListener =
      animatedLongitude.addListener(
        ({
          value,
        }) => {
          setAnimatedDriverLocation(
            (
              current,
            ) => ({
              ...current,

              longitude:
                value,
            }),
          );
        },
      );

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
   * Anima el movimiento del pedido
   * conforme llegan nuevas posiciones
   * del repartidor.
   */
  useEffect(() => {
    if (
      !activeLocation
    ) {
      return;
    }

    animatedLatitude.stopAnimation();
    animatedLongitude.stopAnimation();

    Animated.parallel([
      Animated.timing(
        animatedLatitude,
        {
          toValue:
            driverLatitude,

          duration:
            900,

          easing:
            Easing.linear,

          useNativeDriver:
            false,
        },
      ),

      Animated.timing(
        animatedLongitude,
        {
          toValue:
            driverLongitude,

          duration:
            900,

          easing:
            Easing.linear,

          useNativeDriver:
            false,
        },
      ),
    ]).start();
  }, [
    activeLocation,
    animatedLatitude,
    animatedLongitude,
    driverLatitude,
    driverLongitude,
  ]);

  /*
   * GOOGLE ROUTES
   *
   * Cuando existe una ubicación real
   * del repartidor:
   *
   * driver GPS
   *     ↓
   * get-route
   *     ↓
   * Google Routes
   *     ↓
   * encodedPolyline
   *     ↓
   * coordenadas para react-native-maps
   *
   * También obtenemos:
   *
   * - duración;
   * - distancia.
   *
   * La duración se transforma
   * en minutos y se envía
   * al componente padre mediante
   * onEtaChange.
   *
   * La primera solicitud se hace
   * inmediatamente.
   *
   * Después limitamos los recálculos
   * a máximo uno cada 15 segundos.
   */
  useEffect(() => {
    if (
      !activeLocation
    ) {
      setGoogleRouteCoordinates(
        [],
      );

      onEtaChange?.(
        null,
      );

      return;
    }

    const now =
      Date.now();

    const elapsed =
      now -
      lastRouteRequestAt.current;

    if (
      lastRouteRequestAt.current !==
        0 &&
      elapsed <
        ROUTE_REFRESH_INTERVAL_MS
    ) {
      return;
    }

    let cancelled =
      false;

    async function loadGoogleRoute() {
      lastRouteRequestAt.current =
        Date.now();

      try {
        const {
          data,
          error,
        } =
          await getRoute({
            driverLatitude,
            driverLongitude,
            destinationLatitude,
            destinationLongitude,
          });

        if (
          cancelled
        ) {
          return;
        }

        if (
          error
        ) {
          console.error(
            "TRACKING MAP GOOGLE ROUTE ERROR:",
            error,
          );

          return;
        }

        if (
          !data?.polyline
        ) {
          console.warn(
            "TRACKING MAP GOOGLE ROUTE: No polyline received.",
            data,
          );

          onEtaChange?.(
            null,
          );

          return;
        }

        const routeData =
          data;

        const encodedPolyline =
          data.polyline;

        const decodedCoordinates =
          decodeGooglePolyline(
            encodedPolyline,
          );

        if (
          decodedCoordinates.length <
          2
        ) {
          console.warn(
            "TRACKING MAP GOOGLE ROUTE: Invalid decoded route.",
          );

          onEtaChange?.(
            null,
          );

          return;
        }

        setGoogleRouteCoordinates(
          decodedCoordinates,
        );

        /*
         * Google devuelve duration
         * con formato:
         *
         * "558s"
         *
         * Convertimos:
         *
         * 558 segundos
         * ↓
         * 9.3 minutos
         * ↓
         * 10 min
         *
         * Usamos Math.ceil para evitar
         * mostrar un ETA menor al real.
         */
        const durationSeconds =
          typeof routeData.duration ===
          "string"
            ? Number(
                routeData.duration.replace(
                  "s",
                  "",
                ),
              )
            : NaN;

        if (
          Number.isFinite(
            durationSeconds,
          )
        ) {
          const minutes =
            Math.max(
              1,
              Math.ceil(
                durationSeconds /
                  60,
              ),
            );

          onEtaChange?.(
            minutes,
          );
        } else {
          onEtaChange?.(
            null,
          );
        }

        console.log(
          "TRACKING MAP GOOGLE ROUTE:",
          {
            duration:
              routeData.duration,

            distanceMeters:
              routeData.distanceMeters,

            points:
              decodedCoordinates.length,
          },
        );
      } catch (
        error
      ) {
        if (
          cancelled
        ) {
          return;
        }

        console.error(
          "TRACKING MAP GOOGLE ROUTE UNEXPECTED ERROR:",
          error,
        );
      }
    }

    void loadGoogleRoute();

    return () => {
      cancelled =
        true;
    };
  }, [
    activeLocation,
    driverLatitude,
    driverLongitude,
    destinationLatitude,
    destinationLongitude,
    onEtaChange,
  ]);

  /*
   * Ajusta el mapa una sola vez
   * por entrega para mostrar:
   *
   * - pedido/repartidor;
   * - destino.
   */
  useEffect(() => {
    if (
      hasAdjustedMap.current
    ) {
      return;
    }

    const timeout =
      setTimeout(
        () => {
          mapRef.current?.fitToCoordinates(
            [
              {
                latitude:
                  driverLatitude,

                longitude:
                  driverLongitude,
              },

              {
                latitude:
                  destinationLatitude,

                longitude:
                  destinationLongitude,
              },
            ],
            {
              edgePadding: {
                top:
                  80,

                right:
                  80,

                bottom:
                  80,

                left:
                  80,
              },

              animated:
                true,
            },
          );

          hasAdjustedMap.current =
            true;
        },
        350,
      );

    return () => {
      clearTimeout(
        timeout,
      );
    };
  }, [
    driverLatitude,
    driverLongitude,
    destinationLatitude,
    destinationLongitude,
  ]);

  return (
    <View
      style={
        styles.container
      }
    >
      <MapView
        ref={mapRef}
        style={
          styles.map
        }
        showsCompass={
          false
        }
        showsTraffic
        showsBuildings
        toolbarEnabled={
          false
        }
        showsUserLocation={
          false
        }
        initialRegion={{
          latitude:
            (
              destinationLatitude +
              driverLatitude
            ) /
            2,

          longitude:
            (
              destinationLongitude +
              driverLongitude
            ) /
            2,

          latitudeDelta:
            0.01,

          longitudeDelta:
            0.01,
        }}
      >
        {/*
         * RUTA REAL
         *
         * Esta Polyline ya NO representa
         * por dónde pasó el repartidor.
         *
         * Representa la ruta calculada
         * por Google Routes desde la
         * ubicación actual hasta
         * el destino.
         */}
        {googleRouteCoordinates.length >=
        2 ? (
          <Polyline
            coordinates={
              googleRouteCoordinates
            }
            strokeColor={
              colors.brand
            }
            strokeWidth={
              5
            }
          />
        ) : null}

        {/*
         * PEDIDO / REPARTIDOR
         */}
        <Marker
          coordinate={
            animatedDriverLocation
          }
          anchor={{
            x:
              0.5,

            y:
              0.5,
          }}
        >
          <View
            style={
              styles.markerWrapper
            }
          >
            <View
              style={
                styles.driverMarker
              }
            >
              <Ionicons
                name="cube"
                size={
                  24
                }
                color={
                  colors.textInverse
                }
              />
            </View>

            <Text
              style={
                styles.markerLabel
              }
            >
              {t(
                "orderDetail.yourDriver",
              )}
            </Text>
          </View>
        </Marker>

        {/*
         * DESTINO / CLIENTE
         */}
        <Marker
          coordinate={{
            latitude:
              destinationLatitude,

            longitude:
              destinationLongitude,
          }}
          anchor={{
            x:
              0.5,

            y:
              0.5,
          }}
        >
          <View
            style={
              styles.markerWrapper
            }
          >
            <View
              style={
                styles.destinationMarker
              }
            >
              <Ionicons
                name="home"
                size={
                  22
                }
                color={
                  colors.textInverse
                }
              />
            </View>

            <Text
              style={
                styles.markerLabel
              }
            >
              {t(
                "orderDetail.yourAddress",
              )}
            </Text>
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width:
        "100%",

      height:
        320,

      overflow:
        "hidden",

      borderRadius:
        radius.xl,

      backgroundColor:
        colors.surfaceSoft,
    },

    map: {
      flex:
        1,
    },

    markerWrapper: {
      alignItems:
        "center",
    },

    driverMarker: {
      width:
        48,

      height:
        48,

      borderRadius:
        24,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        colors.brand,

      borderWidth:
        4,

      borderColor:
        colors.surface,

      shadowColor:
        "#000",

      shadowOpacity:
        0.18,

      shadowRadius:
        8,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      elevation:
        8,
    },

    destinationMarker: {
      width:
        48,

      height:
        48,

      borderRadius:
        24,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        colors.brandDark,

      borderWidth:
        4,

      borderColor:
        colors.surface,

      shadowColor:
        "#000",

      shadowOpacity:
        0.18,

      shadowRadius:
        8,

      shadowOffset: {
        width:
          0,

        height:
          4,
      },

      elevation:
        8,
    },

    markerLabel: {
      ...typography.caption,

      marginTop:
        spacing.xs,

      paddingHorizontal:
        spacing.sm,

      paddingVertical:
        4,

      borderRadius:
        radius.pill,

      backgroundColor:
        colors.surface,

      color:
        colors.text,

      fontWeight:
        "800",

      overflow:
        "hidden",
    },
  });