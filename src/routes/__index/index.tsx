import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/__index/")({
    component: Dashboard,
});

function Dashboard() {
    return (
        <div className="p-2">
            <h3>Welcome to your Dashboard!</h3>
        </div>
    );
}
