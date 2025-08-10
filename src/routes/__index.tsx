import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useArticlesStore } from "@/hooks/use-articles-store";
import { useAuthStore } from "@/hooks/use-auth-store";
import { data } from "@/lib/data";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/__index")({
    beforeLoad: () => {
        if (!useAuthStore.getState().user) {
            throw redirect({ to: "/signin" });
        }
    },
    component: DashboardLayout,
});

function DashboardLayout() {
    const { user } = useAuthStore();
    const { initArticles } = useArticlesStore();

    useEffect(() => {
        if (data?.length) initArticles(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                    <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
                        <h1 className="text-base font-medium">Documents</h1>
                        <div className="ml-auto flex items-center gap-2">
                            <Avatar className="h-8 w-8 rounded-full grayscale">
                                <AvatarImage src={user?.image} alt={user?.name} />
                                <AvatarFallback className="rounded-full">{user?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.name}</span>
                                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4 p-4">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
