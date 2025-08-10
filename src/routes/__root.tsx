import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: Root,
});

export default function Root() {
    return <Outlet />;
}
