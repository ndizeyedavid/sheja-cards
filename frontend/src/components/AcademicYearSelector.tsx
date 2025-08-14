"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

const academicYears = [
  {
    value: "2024 / 2025",
    label: "2024 / 2025 (Current)",
  },
  {
    value: "2023 / 2024",
    label: "2023 / 2024",
  },
  {
    value: "2022 / 2023",
    label: "2022 / 2023",
  },
  {
    value: "2021 / 2022",
    label: "2021 / 2022",
  },
];

export function AcademicYearSelector({ disabled = false }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(academicYears[0].value);

  useEffect(() => {
    localStorage.setItem("academicYear", value);
    console.log(value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {value
            ? academicYears.find((academicYear) => academicYear.value === value)
                ?.label
            : "Select Academic year..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search academicYear..." />
          <CommandList>
            <CommandEmpty>No Academic year found.</CommandEmpty>
            <CommandGroup>
              {academicYears.map((academicYear) => (
                <CommandItem
                  key={academicYear.value}
                  value={academicYear.value}
                  autoFocus
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === academicYear.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {academicYear.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
