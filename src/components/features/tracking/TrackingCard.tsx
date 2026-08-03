import { StyleSheet } from "react-native";

import { QuoteStatusType } from "../../../presentation/QuoteViewModel";

import Card from "../../ui/Card";

import TrackingETA from "./TrackingETA";
import TrackingMap from "./TrackingMap";
import TrackingStatus from "./TrackingStatus";

import { useDeliveryTracking } from "../../../hooks/useDeliveryTracking";

import { useEffect, useRef } from "react";

import { getRoute } from "../../../services/routeService";

type Props = {
  deliveryId?: string | null;

  status: QuoteStatusType;

  latitude?: number | null;
  longitude?: number | null;

  trackingTitle: string;
  waitingText: string;
  activeText: string;
  unavailableText: string;

  eta: string;
  etaLabel?: string;
};

export default function TrackingCard({
  deliveryId,
  status,
  latitude,
  longitude,
  trackingTitle,
  waitingText,
  activeText,
  unavailableText,
  eta,
  etaLabel = "Llegada estimada",
}: Props) {
  const {
    location,
    history,
  } = useDeliveryTracking(deliveryId);

  const hasTestedRoute = useRef(false);

useEffect(() => {
  if (
    hasTestedRoute.current ||
    !location ||
    latitude == null ||
    longitude == null
  ) {
    return;
  }

  hasTestedRoute.current = true;

  void getRoute({
    origin: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    destination: {
      latitude,
      longitude,
    },
  }).catch((error) => {
    console.error(
      "ROUTE TEST ERROR:",
      error,
    );
  });
}, [
  location,
  latitude,
  longitude,
]);

  console.log(
    "TRACKING CARD LOCATION:",
    location,
  );

  console.log(
    "TRACKING CARD HISTORY POINTS:",
    history.length,
  );

  return (
    <Card style={styles.card}>
      <TrackingStatus
        status={status}
        title={trackingTitle}
        waitingText={waitingText}
        activeText={activeText}
        unavailableText={unavailableText}
      />

      <TrackingMap
        deliveryId={deliveryId}
        latitude={latitude}
        longitude={longitude}
        location={location}
        history={history}
      />

      <TrackingETA
        eta={eta}
        label={etaLabel}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
});