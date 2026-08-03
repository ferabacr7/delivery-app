import { supabase } from "../lib/supabase";

type InsertTrackingLocationParams = {
  deliveryId: string;
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
};

export type TrackingLocationRow = {
  id: string;
  delivery_id: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  recorded_at: string;
  created_at: string;
};

export async function insertTrackingLocation({
  deliveryId,
  latitude,
  longitude,
  heading,
  speed,
  accuracy,
}: InsertTrackingLocationParams) {
  const { error } = await supabase
    .from("delivery_tracking")
    .insert({
      delivery_id: deliveryId,
      latitude,
      longitude,
      heading,
      speed,
      accuracy,
    });

  if (error) {
    throw error;
  }
}

export async function getLatestTrackingLocation(deliveryId: string) {
  const { data, error } = await supabase
    .from("delivery_tracking")
    .select("*")
    .eq("delivery_id", deliveryId)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    data: data as TrackingLocationRow | null,
    error,
  };
}

export async function getTrackingHistory(deliveryId: string) {
  const { data, error } = await supabase
    .from("delivery_tracking")
    .select("*")
    .eq("delivery_id", deliveryId)
    .order("recorded_at", { ascending: true });

  return {
    data: (data ?? []) as TrackingLocationRow[],
    error,
  };
}

export function subscribeToTrackingLocation(
  deliveryId: string,
  onLocationReceived: (location: TrackingLocationRow) => void,
) {
  const channel = supabase
    .channel(`delivery-tracking-${deliveryId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "delivery_tracking",
        filter: `delivery_id=eq.${deliveryId}`,
      },
      (payload) => {
        const newLocation =
          payload.new as TrackingLocationRow;

        onLocationReceived(newLocation);
      },
    )
    .subscribe((status, error) => {
      console.log(
        "TRACKING REALTIME STATUS:",
        status,
      );

      if (error) {
        console.error(
          "TRACKING REALTIME ERROR:",
          error,
        );
      }
    });

  return channel;
}

export async function unsubscribeFromTrackingLocation(
  channel: ReturnType<typeof supabase.channel>,
) {
  await supabase.removeChannel(channel);
}