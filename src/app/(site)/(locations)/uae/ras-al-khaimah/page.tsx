import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/uae/ras-al-khaimah");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function RasAlKhaimahPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
