import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/qatar/al-wakrah");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function AlWakrahPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
