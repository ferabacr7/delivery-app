import { LocationZone, ResolvedLocation } from "./models";

export class LocationResolver {
  resolve(locationText?: string | null): ResolvedLocation {
    console.log("LOCATION RECEIVED:", locationText);

    const normalizedLocation = locationText?.toLowerCase().trim() ?? "";

    if (
      normalizedLocation.includes("potrero") ||
      normalizedLocation.includes("surfside")
    ) {
      return {
        zone: "LOCAL",
        distanceKm: 3,
      };
    }

    if (
      normalizedLocation.includes("brasilito") ||
      normalizedLocation.includes("flamingo")
    ) {
      return {
        zone: "NEARBY",
        distanceKm: 8,
      };
    }

    return {
      zone: "EXTENDED",
      distanceKm: 15,
    };
  }
}