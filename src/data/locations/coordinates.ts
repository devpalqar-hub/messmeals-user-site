import { cache } from "react";
import { getAllMess } from "../../services/messApi";
import type { MessListing } from "../../types/mess";

export type LocationCoordinate = {
  latitude: string;
  longitude: string;
};

export type LocationCoordinateConfig = {
  defaultCity: string;
  latitude: string;
  longitude: string;
  /** Regional hubs aggregate geo-radius queries across their main city centers. */
  hubCoordinates?: ReadonlyArray<LocationCoordinate>;
};

export const LOCATION_COORDINATES: Record<string, LocationCoordinateConfig> = {
  // ─── Kerala (15) ───────────────────────────────────────────────────────────
  "/kerala": {
    defaultCity: "Kerala",
    latitude: "9.9312",
    longitude: "76.2673",
    hubCoordinates: [
      { latitude: "9.9312", longitude: "76.2673" }, // Ernakulam
      { latitude: "8.5241", longitude: "76.9366" }, // Thiruvananthapuram
      { latitude: "11.2588", longitude: "75.7804" }, // Kozhikode
      { latitude: "10.5276", longitude: "76.2144" }, // Thrissur
      { latitude: "12.4984", longitude: "74.9896" }, // Kasaragod
      { latitude: "11.8745", longitude: "75.3704" }, // Kannur
      { latitude: "11.0510", longitude: "76.0711" }, // Malappuram
      { latitude: "10.7867", longitude: "76.6548" }, // Palakkad
      { latitude: "9.5916", longitude: "76.5222" }, // Kottayam
    ],
  },
  "/kerala/ernakulam": { defaultCity: "Ernakulam", latitude: "9.9312", longitude: "76.2673" },
  "/kerala/thiruvananthapuram": { defaultCity: "Thiruvananthapuram", latitude: "8.5241", longitude: "76.9366" },
  "/kerala/kozhikode": { defaultCity: "Kozhikode", latitude: "11.2588", longitude: "75.7804" },
  "/kerala/thrissur": { defaultCity: "Thrissur", latitude: "10.5276", longitude: "76.2144" },
  "/kerala/kasaragod": { defaultCity: "Kasaragod", latitude: "12.4984", longitude: "74.9896" },
  "/kerala/kannur": { defaultCity: "Kannur", latitude: "11.8745", longitude: "75.3704" },
  "/kerala/malappuram": { defaultCity: "Malappuram", latitude: "11.0510", longitude: "76.0711" },
  "/kerala/palakkad": { defaultCity: "Palakkad", latitude: "10.7867", longitude: "76.6548" },
  "/kerala/kottayam": { defaultCity: "Kottayam", latitude: "9.5916", longitude: "76.5222" },
  "/kerala/ernakulam/kakkanad": { defaultCity: "Kakkanad", latitude: "10.0159", longitude: "76.3419" },
  "/kerala/ernakulam/edappally": { defaultCity: "Edappally", latitude: "10.0261", longitude: "76.3083" },
  "/kerala/ernakulam/vyttila": { defaultCity: "Vyttila", latitude: "9.9658", longitude: "76.3204" },
  "/kerala/thiruvananthapuram/kazhakkoottam": { defaultCity: "Kazhakkoottam", latitude: "8.5686", longitude: "76.8731" },
  "/kerala/thiruvananthapuram/technopark": { defaultCity: "Technopark", latitude: "8.5557", longitude: "76.8814" },

  // ─── UAE (13) ──────────────────────────────────────────────────────────────
  "/uae": {
    defaultCity: "UAE",
    latitude: "25.2048",
    longitude: "55.2708",
    hubCoordinates: [
      { latitude: "25.2048", longitude: "55.2708" }, // Dubai
      { latitude: "25.3463", longitude: "55.4209" }, // Sharjah
      { latitude: "24.4539", longitude: "54.3773" }, // Abu Dhabi
      { latitude: "25.4052", longitude: "55.5136" }, // Ajman
      { latitude: "25.7895", longitude: "55.9432" }, // Ras Al Khaimah
      { latitude: "25.1288", longitude: "56.3265" }, // Fujairah
      { latitude: "25.5647", longitude: "55.5552" }, // Umm Al Quwain
    ],
  },
  "/uae/dubai": { defaultCity: "Dubai", latitude: "25.2048", longitude: "55.2708" },
  "/uae/sharjah": { defaultCity: "Sharjah", latitude: "25.3463", longitude: "55.4209" },
  "/uae/abu-dhabi": { defaultCity: "Abu Dhabi", latitude: "24.4539", longitude: "54.3773" },
  "/uae/ajman": { defaultCity: "Ajman", latitude: "25.4052", longitude: "55.5136" },
  "/uae/ras-al-khaimah": { defaultCity: "Ras Al Khaimah", latitude: "25.7895", longitude: "55.9432" },
  "/uae/fujairah": { defaultCity: "Fujairah", latitude: "25.1288", longitude: "56.3265" },
  "/uae/umm-al-quwain": { defaultCity: "Umm Al Quwain", latitude: "25.5647", longitude: "55.5552" },
  "/uae/dubai/karama": { defaultCity: "Al Karama", latitude: "25.2415", longitude: "55.3020" },
  "/uae/dubai/bur-dubai": { defaultCity: "Bur Dubai", latitude: "25.2532", longitude: "55.2974" },
  "/uae/dubai/deira": { defaultCity: "Deira", latitude: "25.2712", longitude: "55.3289" },
  "/uae/dubai/al-nahda": { defaultCity: "Al Nahda", latitude: "25.2968", longitude: "55.3711" },
  "/uae/abu-dhabi/musaffah": { defaultCity: "Musaffah", latitude: "24.3539", longitude: "54.5042" },

  // ─── Bangalore (13) ────────────────────────────────────────────────────────
  "/bangalore": {
    defaultCity: "Bangalore",
    latitude: "12.9716",
    longitude: "77.5946",
    hubCoordinates: [
      { latitude: "12.9716", longitude: "77.5946" }, // Central Bangalore
      { latitude: "12.8452", longitude: "77.6602" }, // Electronic City
      { latitude: "12.9698", longitude: "77.7500" }, // Whitefield
      { latitude: "13.0458", longitude: "77.6203" }, // Manyata / North
    ],
  },
  "/bangalore/electronic-city": { defaultCity: "Electronic City", latitude: "12.8452", longitude: "77.6602" },
  "/bangalore/whitefield": { defaultCity: "Whitefield", latitude: "12.9698", longitude: "77.7500" },
  "/bangalore/marathahalli": { defaultCity: "Marathahalli", latitude: "12.9591", longitude: "77.6974" },
  "/bangalore/koramangala": { defaultCity: "Koramangala", latitude: "12.9352", longitude: "77.6245" },
  "/bangalore/hsr-layout": { defaultCity: "HSR Layout", latitude: "12.9121", longitude: "77.6446" },
  "/bangalore/btm-layout": { defaultCity: "BTM Layout", latitude: "12.9166", longitude: "77.6101" },
  "/bangalore/bellandur": { defaultCity: "Bellandur", latitude: "12.9255", longitude: "77.6762" },
  "/bangalore/indiranagar": { defaultCity: "Indiranagar", latitude: "12.9784", longitude: "77.6408" },
  "/bangalore/jp-nagar": { defaultCity: "JP Nagar", latitude: "12.9063", longitude: "77.5857" },
  "/bangalore/jayanagar": { defaultCity: "Jayanagar", latitude: "12.9308", longitude: "77.5838" },
  "/bangalore/manyata": { defaultCity: "Manyata Tech Park", latitude: "13.0458", longitude: "77.6203" },
  "/bangalore/itpl": { defaultCity: "ITPL, Whitefield", latitude: "12.9855", longitude: "77.7367" },

  // ─── Qatar (12) ────────────────────────────────────────────────────────────
  "/qatar": {
    defaultCity: "Qatar",
    latitude: "25.2854",
    longitude: "51.5310",
    hubCoordinates: [
      { latitude: "25.2854", longitude: "51.5310" }, // Doha
      { latitude: "25.1715", longitude: "51.6034" }, // Al Wakrah
      { latitude: "25.2919", longitude: "51.4244" }, // Al Rayyan
      { latitude: "25.6804", longitude: "51.4969" }, // Al Khor
      { latitude: "25.4195", longitude: "51.4903" }, // Lusail
      { latitude: "24.9912", longitude: "51.5477" }, // Mesaieed
    ],
  },
  "/qatar/doha": { defaultCity: "Doha", latitude: "25.2854", longitude: "51.5310" },
  "/qatar/al-wakrah": { defaultCity: "Al Wakrah", latitude: "25.1715", longitude: "51.6034" },
  "/qatar/al-rayyan": { defaultCity: "Al Rayyan", latitude: "25.2919", longitude: "51.4244" },
  "/qatar/lusail": { defaultCity: "Lusail", latitude: "25.4195", longitude: "51.4903" },
  "/qatar/al-khor": { defaultCity: "Al Khor", latitude: "25.6804", longitude: "51.4969" },
  "/qatar/mesaieed": { defaultCity: "Mesaieed", latitude: "24.9912", longitude: "51.5477" },
  "/qatar/doha/bin-omran": { defaultCity: "Bin Omran", latitude: "25.2951", longitude: "51.5008" },
  "/qatar/doha/al-sadd": { defaultCity: "Al Sadd", latitude: "25.2820", longitude: "51.4988" },
  "/qatar/doha/najma": { defaultCity: "Najma", latitude: "25.2683", longitude: "51.5419" },
  "/qatar/doha/old-airport": { defaultCity: "Old Airport", latitude: "25.2528", longitude: "51.5594" },
  "/qatar/doha/mansoura": { defaultCity: "Mansoura", latitude: "25.2747", longitude: "51.5364" },
};

export function getLocationCoordinates(path: string): LocationCoordinateConfig | undefined {
  return LOCATION_COORDINATES[path];
}

const fetchMessesByCoords = cache(async (latitude: string, longitude: string): Promise<MessListing[]> => {
  try {
    const res = await getAllMess(1, 50, { latitude, longitude });
    return Array.isArray(res) ? res : res?.data ?? [];
  } catch (err) {
    console.error(`Failed to fetch messes for (${latitude}, ${longitude})`, err);
    return [];
  }
});

/** Fetches live mess listings for a location path using the existing geo-coordinate API. */
export async function getLocationListings(path: string): Promise<{
  messes: MessListing[];
  defaultCity?: string;
}> {
  const config = getLocationCoordinates(path);
  if (!config) {
    return { messes: [] };
  }

  if (config.hubCoordinates && config.hubCoordinates.length > 0) {
    const batches = await Promise.all(
      config.hubCoordinates.map((coord) => fetchMessesByCoords(coord.latitude, coord.longitude))
    );
    const seen = new Map<string, MessListing>();
    for (const batch of batches) {
      for (const mess of batch) {
        if (!seen.has(mess.id)) {
          seen.set(mess.id, mess);
        }
      }
    }
    return {
      messes: Array.from(seen.values()),
      defaultCity: config.defaultCity,
    };
  }

  const list = await fetchMessesByCoords(config.latitude, config.longitude);
  const sorted = [...list].sort(
    (a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY)
  );
  return {
    messes: sorted,
    defaultCity: config.defaultCity,
  };
}
