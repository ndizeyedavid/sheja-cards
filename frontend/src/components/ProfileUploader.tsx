// components/ProfileUploader.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Trash2, UploadCloud } from "lucide-react";

interface ProfileUploaderProps {
    onChange: (file: File | null) => void;
    value: File | null;
    disabled?: boolean;
}

export function ProfileUploader({ onChange, value, disabled }: ProfileUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(value);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [value]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB.");
            return;
        }

        onChange(file);
    };

    return (
        <div className="space-y-3">
            <Label htmlFor="profilePicture">Profile Picture (Optional)</Label>

            {preview && (
                <div className="relative w-32 h-32 rounded-md overflow-hidden border">
                    <img
                        src={preview}
                        alt="Profile Preview"
                        className="object-cover w-full h-full"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 z-10 bg-white hover:bg-red-100"
                        onClick={() => onChange(null)}
                        disabled={disabled}
                    >
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            )}

            <div className="flex items-center gap-3">
                <Input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={disabled}
                    className={cn("max-w-sm hidden", preview && "hidden")}
                />
                {!preview && (
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        asChild
                        disabled={disabled}
                    >
                        <label
                            htmlFor="profilePicture"
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <UploadCloud className="w-4 h-4" />
                            Upload Image
                        </label>
                    </Button>
                )}
            </div>

            {value && (
                <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium">{value.name}</span>
                </p>
            )}
        </div>
    );
}
