import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle";
import { useArticlesStore } from "@/hooks/use-articles-store";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PerformanceChart() {
    const { filtered } = useArticlesStore();
    const [mode, setMode] = useState<"daily" | "monthly">("daily");
    const [type, setType] = useState<"line" | "bar">("line");

    const data = useMemo(() => {
        return filtered.aggregations.byDate[mode];
    }, [filtered, mode]);

    const config = {
        views: {
            label: "Views",
            color: "#FFFFFF",
        },
    } satisfies ChartConfig;

    return (
        <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <ToggleGroup
                    type="single"
                    value={mode}
                    onValueChange={(v) => v && setMode(v as "daily" | "monthly")}
                    className="border rounded-md"
                >
                    <ToggleGroupItem value="daily" className="w-24">
                        Daily
                    </ToggleGroupItem>
                    <ToggleGroupItem value="monthly" className="w-24">
                        Monthly
                    </ToggleGroupItem>
                </ToggleGroup>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant={type === "line" ? "default" : "outline"} size="sm" onClick={() => setType("line")}>
                        Line
                    </Button>
                    <Button variant={type === "bar" ? "default" : "outline"} size="sm" onClick={() => setType("bar")}>
                        Bar
                    </Button>
                </div>
            </div>

            <ChartContainer config={config} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === "line" ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => Intl.NumberFormat().format(v)} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line dataKey="views" stroke="#FFFFFF" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                        </LineChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => Intl.NumberFormat().format(v)} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="views" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth={2} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}
