import { supabase } from "../lib/supabase";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type GetRouteParams = {
  origin: Coordinate;
  destination: Coordinate;
};

export type RouteResult = {
  polyline: string | null;
  distanceMeters: number | null;
  duration: string | null;
};

export async function getRoute({
  origin,
  destination,
}: GetRouteParams): Promise<RouteResult> {
  const { data, error } =
    await supabase.functions.invoke(
      "get-route",
      {
        body: {
          origin,
          destination,
        },
      },
    );

  if (error) {
    console.error(
      "GET ROUTE FUNCTION ERROR:",
      error,
    );

    throw error;
  }

  console.log(
    "GOOGLE ROUTE RESULT:",
    data,
  );

  return data as RouteResult;
}