"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function isValidDate(date: Date | undefined) {
    return date instanceof Date && !isNaN(date.getTime());
}

interface DatePickerProps {
    label?: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function DatePicker({
    label = "Select Date",
    value,
    onChange,
    placeholder = "Select date",
    disabled = false,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<Date | undefined>(value);
    const [inputValue, setInputValue] = React.useState(formatDate(value));

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {label}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={inputValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="bg-background pr-10"
                    onChange={(e) => {
                        const input = e.target.value;
                        const date = new Date(input);
                        setInputValue(input);
                        if (isValidDate(date)) {
                            onChange(date);
                            setMonth(date);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            disabled={disabled}
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                                onChange(date);
                                setInputValue(formatDate(date));
                                setOpen(false);
                            }}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
