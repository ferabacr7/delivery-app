import {
  LocationZone,
  ResolvedLocation,
} from "./models";

type ResolveLocationInput = {
  latitude?: number | null;
  longitude?: number | null;
};

type Coordinate = {
  latitude: number;
  longitude: number;
};

type DeliveryZonePolygon = {
  name: string;
  zone: LocationZone;
  distanceKm: number;
  coordinates: Coordinate[];
};

/**
 * Polígonos iniciales de cobertura.
 *
 * IMPORTANTE:
 * - El orden de los puntos debe seguir el perímetro.
 * - No es necesario repetir el primer punto al final.
 * - Estos polígonos pueden refinarse conforme hagamos
 *   pruebas en los límites reales de cada comunidad.
 */
const DELIVERY_ZONE_POLYGONS: DeliveryZonePolygon[] = [
  {
    name: "Potrero",
    zone: "LOCAL",
    distanceKm: 3,
    coordinates: [
      {
        latitude: 10.465,
        longitude: -85.785,
      },
      {
        latitude: 10.465,
        longitude: -85.755,
      },
      {
        latitude: 10.425,
        longitude: -85.755,
      },
      {
        latitude: 10.425,
        longitude: -85.775,
      },
      {
        latitude: 10.442,
        longitude: -85.783,
      },
    ],
  },

  {
    name: "Flamingo",
    zone: "NEARBY",
    distanceKm: 8,
    coordinates: [
      {
        latitude: 10.452,
        longitude: -85.806,
      },
      {
        latitude: 10.452,
        longitude: -85.783,
      },
      {
        latitude: 10.442,
        longitude: -85.783,
      },
      {
        latitude: 10.425,
        longitude: -85.775,
      },
      {
        latitude: 10.417,
        longitude: -85.793,
      },
      {
        latitude: 10.425,
        longitude: -85.806,
      },
    ],
  },

  {
    name: "Brasilito",
    zone: "EXTENDED",
    distanceKm: 12,
    coordinates: [
      {
        latitude: 10.417,
        longitude: -85.81,
      },
      {
        latitude: 10.417,
        longitude: -85.775,
      },
      {
        latitude: 10.375,
        longitude: -85.775,
      },
      {
        latitude: 10.375,
        longitude: -85.82,
      },
      {
        latitude: 10.4,
        longitude: -85.82,
      },
    ],
  },
];

export class LocationResolver {
  resolve({
    latitude,
    longitude,
  }: ResolveLocationInput): ResolvedLocation {
    console.log("LOCATION COORDINATES:", {
      latitude,
      longitude,
    });

    if (
      latitude == null ||
      longitude == null ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      throw new Error(
        "La dirección seleccionada no contiene coordenadas válidas.",
      );
    }

    const point: Coordinate = {
      latitude,
      longitude,
    };

    const matchedZone =
      DELIVERY_ZONE_POLYGONS.find((deliveryZone) =>
        this.isPointInsidePolygon(
          point,
          deliveryZone.coordinates,
        ),
      );

    if (!matchedZone) {
      console.warn("LOCATION OUTSIDE COVERAGE:", {
        latitude,
        longitude,
      });

      throw new Error(
        "La ubicación seleccionada está fuera de la zona de cobertura.",
      );
    }

    console.log("DELIVERY ZONE RESOLVED:", {
      name: matchedZone.name,
      zone: matchedZone.zone,
      distanceKm: matchedZone.distanceKm,
      latitude,
      longitude,
    });

    return {
      zone: matchedZone.zone,
      distanceKm: matchedZone.distanceKm,
    };
  }

  /**
   * Algoritmo Ray Casting.
   *
   * Traza una línea imaginaria desde el punto y cuenta
   * cuántas veces cruza los bordes del polígono.
   *
   * Un número impar de cruces significa que el punto
   * se encuentra dentro del polígono.
   */
  private isPointInsidePolygon(
    point: Coordinate,
    polygon: Coordinate[],
  ): boolean {
    let isInside = false;

    const x = point.longitude;
    const y = point.latitude;

    for (
      let currentIndex = 0,
        previousIndex = polygon.length - 1;
      currentIndex < polygon.length;
      previousIndex = currentIndex++
    ) {
      const currentPoint = polygon[currentIndex];
      const previousPoint = polygon[previousIndex];

      const currentX = currentPoint.longitude;
      const currentY = currentPoint.latitude;

      const previousX = previousPoint.longitude;
      const previousY = previousPoint.latitude;

      const crossesLatitude =
        currentY > y !== previousY > y;

      const intersectionLongitude =
        ((previousX - currentX) *
          (y - currentY)) /
          (previousY - currentY) +
        currentX;

      const crossesPolygon =
        crossesLatitude &&
        x < intersectionLongitude;

      if (crossesPolygon) {
        isInside = !isInside;
      }
    }

    return isInside;
  }
}