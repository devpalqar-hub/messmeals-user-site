import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/kerala/kasaragod");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function KasaragodPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
