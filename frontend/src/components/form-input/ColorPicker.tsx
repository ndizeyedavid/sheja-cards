"use client";

import { forwardRef } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
// @ts-ignore
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface ColorPickerProps extends Omit<ButtonProps, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker = forwardRef<HTMLButtonElement, ColorPickerProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const color = value || "#FFFFFF";

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              className
            )}
          >
            <div
              className="w-4 h-4 rounded-full mr-2 border"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <HexColorPicker color={color} onChange={onChange} />
          <Input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-4"
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
