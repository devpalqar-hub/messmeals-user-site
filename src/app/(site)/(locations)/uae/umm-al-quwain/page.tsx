import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/uae/umm-al-quwain");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function UmmAlQuwainPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
