"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useRef, useState } from "react";

interface OTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
  containerClassName?: string;
  inputClassName?: string;
}

const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  (
    { className, maxLength = 6, containerClassName, inputClassName, ...props },
    ref
  ) => {
    const [values, setValues] = useState<string[]>(Array(maxLength).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);

      // Move to next input if current input is filled
      if (value && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Call onChange with combined value
      const combinedValue = newValues.join("");
      if (props.onChange) {
        const syntheticEvent = {
          target: { value: combinedValue },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace" && !values[index] && index > 0) {
        // Move to previous input on backspace if current input is empty
        inputRefs.current[index - 1]?.focus();
        const newValues = [...values];
        newValues[index - 1] = "";
        setValues(newValues);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, maxLength);
      const newValues = Array(maxLength).fill("");

      for (let i = 0; i < pastedData.length && i < maxLength; i++) {
        newValues[i] = pastedData[i];
      }

      setValues(newValues);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newValues.findIndex((val) => val === "");
      const focusIndex = nextEmptyIndex === -1 ? maxLength - 1 : nextEmptyIndex;
      inputRefs.current[focusIndex]?.focus();

      if (props.onChange) {
        const syntheticEvent = {
          target: { value: newValues.join("") },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }
    };

    return (
      <div className={cn("flex gap-2", containerClassName)}>
        {values.map((value, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              handleChange(index, numericValue);
            }}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              "transition-all duration-200",
              inputClassName
            )}
            disabled={props.disabled}
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export { OTPInput };
