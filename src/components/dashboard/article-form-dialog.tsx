import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArticlesStore, type Article } from "@/hooks/use-articles-store";
import { useForm } from "@tanstack/react-form";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "../form/form-input";

type ArticleFormDialogProps = {
    article: Article | null;
    children: ReactNode;
    disabled?: boolean;
};

const ArticleSchema = z.object({
    title: z.string().min(1, "Title is required."),
    content: z.string().min(1, "Content is required."),
    status: z.enum(["PUBLISHED", "DRAFT"]),
});

export function ArticleFormDialog({ article, children, disabled = false }: ArticleFormDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { createArticle, updateArticle } = useArticlesStore();

    const form = useForm({
        defaultValues: {
            title: article?.title || "",
            content: article?.content || "",
            status: article?.status || "DRAFT",
        },
        validators: {
            onChange: ArticleSchema,
        },
        onSubmit: (values) => {
            setIsLoading(true);
            // Mock API latency
            setTimeout(() => {
                if (!article) {
                    createArticle(values.value);
                } else {
                    updateArticle(article.id, values.value);
                }
                setIsLoading(false);
                setOpen(false);
                toast.success("Article saved successfully");
            }, 500);
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild disabled={disabled}>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                    <DialogDescription>Update the article fields and save your changes.</DialogDescription>
                </DialogHeader>
                <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <FormInput form={form} name="title" label="Title" />
                    <FormInput form={form} name="content" label="Content" textarea />
                    <form.Field name="status">
                        {({ state, handleChange }) => (
                            <Select value={state.value} onValueChange={(v) => handleChange(v as "PUBLISHED" | "DRAFT")}>
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </form.Field>
                    <div className="grid grid-cols-[110px_1fr] gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <form.Subscribe
                            selector={(state) => [state.canSubmit]}
                            children={([canSubmit]) => (
                                <Button type="submit" className="w-full" disabled={!canSubmit}>
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                            )}
                        />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
