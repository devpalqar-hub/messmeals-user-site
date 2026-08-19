import { Trophy } from "lucide-react";
import MessListingRow from "../components/ui/MessListingSection/MessListingRow";

export default function TopRated() {
  return (
    <MessListingRow
      title="Top-rated messes near you"
      icon={Trophy}
      badgeType="top-rated"
      subtitle="Discover highly rated messes serving fresh, homely meals around you."
    />
  );
}
