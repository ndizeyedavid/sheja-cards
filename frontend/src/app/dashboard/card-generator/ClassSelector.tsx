"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchClasses } from "@/services/classes.service";

import { Classes } from "@/types/classes.types";

type Class = Classes;

export function ClassSelector({
    selectedClass,
    setSelectedClass,
}: {
    selectedClass: Class | null;
    setSelectedClass: (Class: Class | null) => void;
}) {
    const [open, setOpen] = React.useState(false);
    const [classes, setClasses] = React.useState<Class[]>([]);

    React.useEffect(() => {
        (async () => {
            const res = await fetchClasses();
            setClasses(res);
        })();
    }, []);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[250px] justify-between"
                >
                    {selectedClass
                        ? `${selectedClass.name} ${selectedClass.combination}`
                        : "Select Class..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder="Search Class..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No Classes found.</CommandEmpty>
                        <CommandGroup>
                            {classes.map((Class) => {
                                const display = `${Class.name} ${Class.combination}`;
                                return (
                                    <CommandItem
                                        key={Class.id}
                                        value={display.toLowerCase()}
                                        onSelect={() => {
                                            setSelectedClass(Class);
                                            setOpen(false);
                                        }}
                                    >
                                        {display}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                selectedClass?.id === Class.id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
