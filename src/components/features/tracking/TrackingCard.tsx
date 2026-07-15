import { StyleSheet } from "react-native";

import { spacing } from "../../../constants/theme";
import Card from "../../ui/Card";

import TrackingETA from "./TrackingETA";
import TrackingMap from "./TrackingMap";
import TrackingStatus from "./TrackingStatus";

type Props = {
  deliveryId?: string | null;

  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "expired"
    | "unknown";

  latitude?: number | null;
  longitude?: number | null;

  trackingTitle: string;
  waitingText: string;
  activeText: string;
  unavailableText: string;
  updatedText: string;

  eta: string;
  updatedAt: string;
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
  updatedText,

  eta,
  updatedAt,
}: Props) {
  return (
    <Card style={styles.card}>
      <TrackingStatus
        status={status}
        title={trackingTitle}
        waitingText={waitingText}
        activeText={activeText}
        unavailableText={unavailableText}
        updatedText={updatedText}
      />

      <TrackingMap
        deliveryId={deliveryId}
        latitude={latitude}
        longitude={longitude}
      />

      <TrackingETA
        eta={eta}
        updatedAt={updatedAt}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
});