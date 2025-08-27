"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IconFilter } from "@tabler/icons-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface FiltercardProps {
    classes: string[];
    setIsLoading: (loading: boolean) => void;
    setIsFiltered: (filtered: boolean) => void;
    selectedClass: string;
    setSelectedClass: (className: string) => void;
}

export default function Filtercard({
    classes,
    setIsLoading,
    setIsFiltered,
    selectedClass,
    setSelectedClass,
}: FiltercardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const handleFilter = async () => {
        if (selectedClass === "-") return;

        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("class", selectedClass);
        router.replace(`${pathname}?${params.toString()}`);

        router.push(`${pathname}?${params.toString()}`);

        setIsLoading(true);
        setIsFiltered(true);
        // Simulate API call
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
    };

    return (
        <Card id="no-print">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Filter Students</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Select Class</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="-" disabled>
                                - Choose class -
                            </SelectItem>
                            {classes.map((className) => (
                                <SelectItem key={className} value={className}>
                                    {className}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button className="sm:ml-auto" onClick={() => handleFilter()}>
                        <IconFilter className="mr-2 h-4 w-4" />
                        Filter Students
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
