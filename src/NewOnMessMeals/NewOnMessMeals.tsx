import { Sparkles } from "lucide-react";
import MessListingRow from "../components/ui/MessListingSection/MessListingRow";

export default function NewOnMessMeals() {
  return (
    <MessListingRow
      title="New on MessMeals"
      icon={Sparkles}
      badgeType="new"
      subtitle="Discover recently added messes and fresh meal options near you."
    />
  );
}
