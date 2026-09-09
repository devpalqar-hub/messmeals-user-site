// "use client" is required here (not optional): this component passes the
// `ShieldCheck` icon component reference as a prop to <MessListingRow>, a
// Client Component — passing a raw component/function reference across the
// Server→Client boundary is not serializable in React Server Components.
"use client";

import { ShieldCheck } from "lucide-react";
import MessListingRow from "../../components/ui/MessListingRow/MessListingRow";

import type { MessListing } from "../../types/mess";

export default function VerifiedMesses({ initialData }: { initialData?: MessListing[] }) {
  return (
    <MessListingRow
      title="Verified Messes Near You"
      icon={ShieldCheck}
      badgeType="verified"
      subtitle="Trusted and verified messes you can count on for quality and hygiene."
      apiFilter={{ isVerified: "true" }}
      initialData={initialData}
    />
  );
}
