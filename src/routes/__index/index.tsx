import { Toolbar } from "@/components/dashboard/toolbar";
import { createFileRoute } from "@tanstack/react-router";
import { ArticleTable } from "@/components/dashboard/article-table";

export const Route = createFileRoute("/__index/")({
    component: Dashboard,
});

function Dashboard() {
    return (
        <>
            <Toolbar />
            <ArticleTable />
        </>
    );
}
