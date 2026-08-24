import { Flame } from "lucide-react";
import MessListingRow from "../../components/ui/MessListingSection/MessListingRow";

export default function PopularAroundYou() {
  return (
    <MessListingRow
      title="Popular around you"
      icon={Flame}
      badgeType="popular"
      subtitle="See the messes people in your area are choosing right now."
    />
  );
}
