import type { LocationPageData } from "../../types/location";
import {
  KERALA_HUB_DATA,
  KERALA_CITY_PAGES,
  KERALA_LOCALITY_PAGES,
} from "./kerala";
import {
  UAE_HUB_DATA,
  UAE_CITY_PAGES,
  UAE_LOCALITY_PAGES,
} from "./uae";
import {
  BANGALORE_HUB_DATA,
  BANGALORE_LOCALITY_PAGES,
} from "./bangalore";
import {
  QATAR_HUB_DATA,
  QATAR_CITY_PAGES,
  QATAR_LOCALITY_PAGES,
} from "./qatar";

export const ALL_LOCATION_PAGES: LocationPageData[] = [
  KERALA_HUB_DATA,
  ...KERALA_CITY_PAGES,
  ...KERALA_LOCALITY_PAGES,
  UAE_HUB_DATA,
  ...UAE_CITY_PAGES,
  ...UAE_LOCALITY_PAGES,
  BANGALORE_HUB_DATA,
  ...BANGALORE_LOCALITY_PAGES,
  QATAR_HUB_DATA,
  ...QATAR_CITY_PAGES,
  ...QATAR_LOCALITY_PAGES,
];

const LOCATION_BY_PATH = new Map<string, LocationPageData>(
  ALL_LOCATION_PAGES.map((item) => [item.path, item])
);

const LOCATION_BY_ID = new Map<string, LocationPageData>(
  ALL_LOCATION_PAGES.map((item) => [item.id, item])
);

export function getLocationByPath(path: string): LocationPageData {
  const found = LOCATION_BY_PATH.get(path);
  if (!found) {
    throw new Error(`Missing location page data for path: ${path}`);
  }
  return found;
}

export function getLocationById(id: string): LocationPageData | undefined {
  return LOCATION_BY_ID.get(id);
}

export function getIndexableLocationPages(): LocationPageData[] {
  return ALL_LOCATION_PAGES.filter((page) => page.indexable);
}

export {
  KERALA_HUB_DATA,
  KERALA_CITY_PAGES,
  KERALA_LOCALITY_PAGES,
  UAE_HUB_DATA,
  UAE_CITY_PAGES,
  UAE_LOCALITY_PAGES,
  BANGALORE_HUB_DATA,
  BANGALORE_LOCALITY_PAGES,
  QATAR_HUB_DATA,
  QATAR_CITY_PAGES,
  QATAR_LOCALITY_PAGES,
};
