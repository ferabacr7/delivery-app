import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Card from "../../ui/Card";
import { colors, radius, spacing, typography } from "../../../constants/theme";

type Props = {
  title: string;
  address: string;
  reference?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string;
  wazeUrl?: string;
};

export default function LocationCard({
  title,
  address,
  reference,
  latitude,
  longitude,
  googleMapsUrl,
  wazeUrl,
}: Props) {
  const hasCoordinates =
    typeof latitude === "number" && typeof longitude === "number";

  const finalGoogleMapsUrl =
    googleMapsUrl ??
    (hasCoordinates
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : undefined);

  const finalWazeUrl =
    wazeUrl ??
    (hasCoordinates
      ? `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
      : undefined);

  const openNavigationUrl = async (url?: string) => {
    if (!url) return;

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn("No fue posible abrir la aplicación de navegación.", error);
    }
  };

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>

      {hasCoordinates ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>
      ) : (
        <View style={styles.mapFallback}>
          <Text style={styles.mapFallbackIcon}>📍</Text>
          <Text style={styles.mapFallbackText}>Ubicación de entrega</Text>
        </View>
      )}

      <View style={styles.details}>
        <Text style={styles.address}>{address}</Text>

        {reference ? <Text style={styles.reference}>{reference}</Text> : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.navChip}
          onPress={() => openNavigationUrl(finalWazeUrl)}
        >
          <Text style={styles.navChipText}>Waze</Text>
        </Pressable>

        <Pressable
          style={styles.navChip}
          onPress={() => openNavigationUrl(finalGoogleMapsUrl)}
        >
          <Text style={styles.navChipText}>Google Maps</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.subtitle,
    marginBottom: spacing.md,
  },

  mapContainer: {
    height: 170,
    borderRadius: radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },

  map: {
    flex: 1,
  },

  mapFallback: {
    height: 170,
    borderRadius: radius.xl,
    backgroundColor: colors.brandSoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  mapFallbackIcon: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },

  mapFallbackText: {
    ...typography.caption,
    color: colors.brandDark,
    fontWeight: "700",
  },

  details: {
    marginBottom: spacing.lg,
  },

  address: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600",
  },

  reference: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  navChip: {
    flex: 1,
    height: 42,
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },

  navChipText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 14,
  },
});