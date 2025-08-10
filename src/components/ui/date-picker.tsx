"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerProps = {
    value?: string;
    onChange: (value?: string) => void;
    placeholder?: string;
};

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" id="date" style={{ paddingLeft: 36 }} className="w-full justify-between font-normal">
                    {value
                        ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                        : placeholder || "Select date"}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        onChange(date ? date.toISOString() : undefined);
                        setOpen(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
