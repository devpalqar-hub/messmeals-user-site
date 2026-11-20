import LocationGuideTemplate from "../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/bangalore/bellandur");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function BellandurPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
