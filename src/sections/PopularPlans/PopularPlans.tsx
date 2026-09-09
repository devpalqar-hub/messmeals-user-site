import PopularPlanRow from "../../components/ui/PopularPlanRow/PopularPlanRow";

import type { PopularPlan } from "../../types/popularPlan";

export default function PopularPlans({ initialData }: { initialData?: PopularPlan[] }) {
  return <PopularPlanRow initialData={initialData} />;
}
