import { Star } from "lucide-react";
import MessListingRow from "../../components/ui/MessListingRow/MessListingRow";

export default function FeaturedMesses() {
  return (
    <MessListingRow
      title="Featured Messes"
      icon={Star}
      badgeType="featured"
      subtitle="Hand-picked featured messes offering the best homely dining experience."
      apiFilter={{ featured: "true" }}
    />
  );
}
