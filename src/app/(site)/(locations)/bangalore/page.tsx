import LocationGuideTemplate from "../../../../components/location/LocationGuideTemplate";
import { getLocationByPath } from "../../../../data/locations";
import { buildLocationMetadata } from "../../../../lib/locationSeo";

const PAGE_DATA = getLocationByPath("/bangalore");

export const metadata = buildLocationMetadata(PAGE_DATA);

export default function BangaloreHubPage() {
  return <LocationGuideTemplate data={PAGE_DATA} />;
}
