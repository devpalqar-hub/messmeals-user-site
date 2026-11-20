import LocationGuideTemplate from "../../../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../../../data/locations";
import { buildLocationMetadata } from "../../../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/kerala/ernakulam/vyttila");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function VyttilaPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
