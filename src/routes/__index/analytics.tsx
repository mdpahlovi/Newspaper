import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__index/analytics")({
    component: Analytics,
});

function Analytics() {
    return (
        <div className="p-2">
            <h3>Analytics</h3>
        </div>
    );
}
