import { Wallet } from "lucide-react";
import MessListingRow from "../components/ui/MessListingSection/MessListingRow";

export default function AffordableMeals() {
  return (
    <MessListingRow
      title="Affordable meals, great value"
      icon={Wallet}
      badgeType="affordable"
      subtitle="Find budget-friendly mess plans that fit your everyday routine."
    />
  );
}
