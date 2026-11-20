import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/kerala/thiruvananthapuram");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function ThiruvananthapuramPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
