import { ShieldCheck } from "lucide-react";
import MessListingRow from "../../components/ui/MessListingRow/MessListingRow";

export default function VerifiedMesses() {
  return (
    <MessListingRow
      title="Verified Messes Near You"
      icon={ShieldCheck}
      badgeType="verified"
      subtitle="Trusted and verified messes you can count on for quality and hygiene."
      apiFilter={{ isVerified: "true" }}
    />
  );
}
