import LocationGuideTemplate from "../../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/uae/dubai/deira");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function DeiraPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
