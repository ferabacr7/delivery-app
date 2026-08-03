import { useEffect, useState } from "react";

import {
  getTrackingHistory,
  subscribeToTrackingLocation,
  TrackingLocationRow,
  unsubscribeFromTrackingLocation,
} from "../services/trackingService";

export type DeliveryTrackingLocation = {
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  recordedAt: string | null;
};

type UseDeliveryTrackingResult = {
  location: DeliveryTrackingLocation | null;
  history: DeliveryTrackingLocation[];
  loading: boolean;
  error: Error | null;
};

function normalizeOptionalNumber(
  value: number | string | null | undefined,
): number | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : null;
}

function normalizeHeading(
  heading: number | string | null | undefined,
): number | null {
  const normalizedHeading =
    normalizeOptionalNumber(heading);

  if (
    normalizedHeading === null ||
    normalizedHeading < 0
  ) {
    return null;
  }

  return normalizedHeading % 360;
}

function mapTrackingRow(
  row: TrackingLocationRow,
  previousLocation?: DeliveryTrackingLocation | null,
): DeliveryTrackingLocation | null {
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const heading = normalizeHeading(row.heading);

  return {
    latitude,
    longitude,

    heading:
      heading ??
      previousLocation?.heading ??
      null,

    speed: normalizeOptionalNumber(row.speed),
    accuracy: normalizeOptionalNumber(row.accuracy),

    recordedAt:
      row.recorded_at ??
      row.created_at ??
      null,
  };
}

function mapTrackingHistory(
  rows: TrackingLocationRow[],
): DeliveryTrackingLocation[] {
  const mappedHistory: DeliveryTrackingLocation[] = [];

  let previousLocation:
    | DeliveryTrackingLocation
    | null = null;

  for (const row of rows) {
    const mappedLocation =
      mapTrackingRow(
        row,
        previousLocation,
      );

    if (!mappedLocation) {
      continue;
    }

    mappedHistory.push(mappedLocation);
    previousLocation = mappedLocation;
  }

  return mappedHistory;
}

export function useDeliveryTracking(
  deliveryId?: string | null,
): UseDeliveryTrackingResult {
  const [location, setLocation] =
    useState<DeliveryTrackingLocation | null>(null);

  const [history, setHistory] =
    useState<DeliveryTrackingLocation[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<Error | null>(null);

  useEffect(() => {
    setLocation(null);
    setHistory([]);
    setError(null);

    if (!deliveryId) {
      setLoading(false);
      return;
    }

    const validDeliveryId = deliveryId;

    let isMounted = true;

    setLoading(true);

    async function loadTrackingHistory() {
      try {
        const {
          data,
          error: trackingError,
        } = await getTrackingHistory(
          validDeliveryId,
        );

        if (trackingError) {
          throw trackingError;
        }

        if (!isMounted) {
          return;
        }

        const mappedHistory =
          mapTrackingHistory(data);

        setHistory(mappedHistory);

        setLocation(
          mappedHistory.length > 0
            ? mappedHistory[
                mappedHistory.length - 1
              ]
            : null,
        );

        setLoading(false);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }

        const normalizedError =
          caughtError instanceof Error
            ? caughtError
            : new Error(
                "No se pudo cargar el tracking del repartidor.",
              );

        console.error(
          "DELIVERY TRACKING LOAD ERROR:",
          normalizedError,
        );

        setError(normalizedError);
        setLoading(false);
      }
    }

    void loadTrackingHistory();

    const channel =
      subscribeToTrackingLocation(
        validDeliveryId,
        (newLocation) => {
          if (!isMounted) {
            return;
          }

          setLocation((currentLocation) => {
            const mappedLocation =
              mapTrackingRow(
                newLocation,
                currentLocation,
              );

            if (!mappedLocation) {
              console.warn(
                "DELIVERY TRACKING REALTIME LOCATION INVALID:",
                newLocation,
              );

              return currentLocation;
            }

            setHistory((currentHistory) => [
              ...currentHistory,
              mappedLocation,
            ]);

            return mappedLocation;
          });

          setError(null);
          setLoading(false);
        },
      );

    return () => {
      isMounted = false;

      void unsubscribeFromTrackingLocation(
        channel,
      );
    };
  }, [deliveryId]);

  return {
    location,
    history,
    loading,
    error,
  };
}