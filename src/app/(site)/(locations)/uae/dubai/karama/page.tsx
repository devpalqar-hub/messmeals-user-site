import LocationGuideTemplate from "../../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/uae/dubai/karama");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function KaramaPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
