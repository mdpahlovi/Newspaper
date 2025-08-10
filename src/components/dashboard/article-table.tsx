"use client";

import { ArticleFormDialog } from "@/components/dashboard/article-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useArticlesStore } from "@/hooks/use-articles-store";
import { useAuthStore } from "@/hooks/use-auth-store";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Edit3, Eye, Heart, MessageSquare } from "lucide-react";
import { useMemo } from "react";

export function ArticleTable() {
    const { user } = useAuthStore();
    const { filtered, total, filters, setFilters } = useArticlesStore();

    const sortIcon = useMemo(() => {
        return filters.sortDir === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    }, [filters.sortDir]);

    const setSort = (sortBy: "views" | "likes" | "comments") => {
        setFilters({
            ...filters,
            sortBy,
            sortDir: filters.sortBy === sortBy && filters.sortDir === "desc" ? "asc" : "desc",
            page: 1,
        });
    };

    const totalPages = Math.max(1, Math.ceil(total / 10));

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>
                        <button className="inline-flex items-center gap-1 hover:underline" onClick={() => setSort("views")}>
                            <Eye className="w-4 h-4" /> Views {filters.sortBy === "views" ? sortIcon : null}
                        </button>
                    </TableHead>
                    <TableHead>
                        <button className="inline-flex items-center gap-1 hover:underline" onClick={() => setSort("likes")}>
                            <Heart className="w-4 h-4" /> Likes {filters.sortBy === "likes" ? sortIcon : null}
                        </button>
                    </TableHead>
                    <TableHead>
                        <button className="inline-flex items-center gap-1 hover:underline" onClick={() => setSort("comments")}>
                            <MessageSquare className="w-4 h-4" /> Comments {filters.sortBy === "comments" ? sortIcon : null}
                        </button>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filtered.articles.map((a) => (
                    <TableRow key={a.id}>
                        <TableCell>{a.title}</TableCell>
                        <TableCell>{a.author}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span>
                                    {new Date(a.publishedAt).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <Badge
                                    variant={a.status === "PUBLISHED" ? "default" : "secondary"}
                                    className={cn("rounded-full px-2 py-0 text-[10px]", a.status === "DRAFT" && "bg-muted text-foreground")}
                                >
                                    {a.status}
                                </Badge>
                            </div>
                        </TableCell>
                        <TableCell>{a.views.toLocaleString()}</TableCell>
                        <TableCell>{a.likes.toLocaleString()}</TableCell>
                        <TableCell>{a.comments.toLocaleString()}</TableCell>
                        <TableCell>
                            <ArticleFormDialog article={a} disabled={user?.role !== "ADMIN"}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 bg-transparent"
                                    disabled={user?.role !== "ADMIN"}
                                    title={user?.role !== "ADMIN" ? "Users cannot edit" : "Edit"}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit
                                </Button>
                            </ArticleFormDialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={7}>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {(filtered.page - 1) * 10 + 1}–{(filtered.page - 1) * 10 + filtered.articles.length} of {total}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                                    disabled={filters.page <= 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {filters.page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters({ ...filters, page: Math.min(totalPages, filters.page + 1) })}
                                    disabled={filters.page >= totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
