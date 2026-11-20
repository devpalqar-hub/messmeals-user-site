import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/kerala/kottayam");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function KottayamPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
