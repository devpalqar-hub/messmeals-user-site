// "use client" is required here (not optional): this component passes the
// `Star` icon component reference as a prop to <MessListingRow>, a Client
// Component — passing a raw component/function reference across the
// Server→Client boundary is not serializable in React Server Components.
"use client";

import { Star } from "lucide-react";
import MessListingRow from "../../components/ui/MessListingRow/MessListingRow";

import type { MessListing } from "../../types/mess";

export default function FeaturedMesses({ initialData }: { initialData?: MessListing[] }) {
  return (
    <MessListingRow
      title="Featured Messes"
      icon={Star}
      badgeType="featured"
      subtitle="Hand-picked featured messes offering the best homely dining experience."
      apiFilter={{ featured: "true" }}
      initialData={initialData}
    />
  );
}
