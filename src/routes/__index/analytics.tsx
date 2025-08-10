import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__index/analytics")({
    component: Analytics,
});

function Analytics() {
    return <PerformanceChart />;
}
