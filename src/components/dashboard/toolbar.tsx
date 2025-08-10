import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useArticlesStore } from "@/hooks/use-articles-store";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "../ui/date-picker";

export function Toolbar() {
    const { authors, filters, setFilters } = useArticlesStore();

    const [searchLocal, setSearchLocal] = useState(filters.search);
    const [startLocal, setStartLocal] = useState(filters.startDate);
    const [endLocal, setEndLocal] = useState(filters.endDate);
    const [authorLocal, setAuthorLocal] = useState(filters.author ?? "all");

    useEffect(() => {
        const t = setTimeout(() => {
            setFilters({
                ...filters,
                search: searchLocal,
                startDate: startLocal || undefined,
                endDate: endLocal || undefined,
                author: authorLocal === "all" ? undefined : authorLocal,
                page: 1,
            });
        }, 300);
        return () => clearTimeout(t);
    }, [searchLocal, startLocal, endLocal, authorLocal]); // eslint-disable-line react-hooks/exhaustive-deps

    const authorOptions = useMemo(() => ["all", ...authors], [authors]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title..."
                        className="pl-9"
                        value={searchLocal}
                        onChange={(e) => setSearchLocal(e.target.value)}
                    />
                </div>
            </div>
            <div className="md:col-span-3">
                <Label className="sr-only">Author</Label>
                <Select value={authorLocal} onValueChange={setAuthorLocal}>
                    <SelectTrigger>
                        <SelectValue placeholder="Author" />
                    </SelectTrigger>
                    <SelectContent>
                        {authorOptions.map((a) => (
                            <SelectItem key={a} value={a}>
                                {a === "all" ? "All authors" : a}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className={cn("md:col-span-5 grid grid-cols-2 gap-3")}>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <DatePicker value={startLocal} onChange={(value) => setStartLocal(value)} placeholder="Start date" />
                </div>
                <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <DatePicker value={endLocal} onChange={(value) => setEndLocal(value)} placeholder="End date" />
                </div>
            </div>
        </div>
    );
}
