import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type RouteCoordinates = {
  latitude: number;
  longitude: number;
};

export type RouteResult = {
  polyline: string | null;
  duration: string | null;
  distanceMeters: number | null;
};

type GetRouteParams = {
  driverLatitude: number;
  driverLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
};

export async function getRoute({
  driverLatitude,
  driverLongitude,
  destinationLatitude,
  destinationLongitude,
}: GetRouteParams) {
  const { data, error } =
    await supabase.functions.invoke<RouteResult>(
      "get-route",
      {
        body: {
          origin: {
            latitude: driverLatitude,
            longitude: driverLongitude,
          },

          destination: {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
          },
        },
      },
    );

  if (error instanceof FunctionsHttpError) {
    try {
      const errorBody =
        await error.context.json();

      console.error(
        "GET ROUTE HTTP ERROR BODY:",
        errorBody,
      );
    } catch (contextError) {
      console.error(
        "GET ROUTE HTTP ERROR CONTEXT:",
        contextError,
      );
    }
  } else if (
    error instanceof FunctionsRelayError
  ) {
    console.error(
      "GET ROUTE RELAY ERROR:",
      error,
    );
  } else if (
    error instanceof FunctionsFetchError
  ) {
    console.error(
      "GET ROUTE FETCH ERROR:",
      error,
    );
  } else if (error) {
    console.error(
      "GET ROUTE UNKNOWN ERROR:",
      error,
    );
  }

  return {
    data: data ?? null,
    error,
  };
}

export function decodeGooglePolyline(
  encoded: string,
): RouteCoordinates[] {
  const points: RouteCoordinates[] = [];

  let index = 0;
  let latitude = 0;
  let longitude = 0;

  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte: number;

    do {
      byte =
        encoded.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;
    } while (byte >= 0x20);

    const latitudeChange =
      result & 1
        ? ~(result >> 1)
        : result >> 1;

    latitude += latitudeChange;

    result = 0;
    shift = 0;

    do {
      byte =
        encoded.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;
    } while (byte >= 0x20);

    const longitudeChange =
      result & 1
        ? ~(result >> 1)
        : result >> 1;

    longitude += longitudeChange;

    points.push({
      latitude: latitude / 1e5,
      longitude: longitude / 1e5,
    });
  }

  return points;
}