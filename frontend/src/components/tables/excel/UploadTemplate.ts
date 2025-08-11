"use client";

import { toast } from "sonner";
// @ts-ignore
import Papa from "papaparse";
import { createStudent } from "@/services/students.service";
// import { useRouter } from "next/navigation";

export function handleTemplate(selectedClass: string) {
    //     const router = useRouter();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";

    input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const text = event.target?.result as string;

                // Split raw CSV text into lines
                const lines = text
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean);

                // Remove title row and optional empty row
                const dataWithoutTitle = lines.slice(2); // assuming first 2 rows are title + spacing

                const cleanedCsv = dataWithoutTitle.join("\n");

                // Parse with custom headers
                const result = Papa.parse(cleanedCsv, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header: string) => {
                        switch (header.trim().toLowerCase()) {
                            case "name":
                                return "name";
                            case "gender":
                                return "gender";
                            case "date of birth":
                                return "dateOfBirth";
                            case "registration number(optional)":
                                return "registrationNumber";
                            default:
                                return "registrationNumber";
                        }
                    },
                });

                if (result.errors.length) {
                    console.error("CSV parse errors:", result.errors);
                    toast.error("CSV parsing failed. Check formatting.");
                    return;
                }

                const parsedData = result.data as Array<{
                    name: string;
                    gender: string;
                    dateOfBirth: string;
                    registrationNumber?: string;
                }>;

                // Create students one by one
                let successCount = 0;
                let errorCount = 0;

                for (const studentData of parsedData) {
                    try {
                        await createStudent({
                            data: studentData,
                            Class: selectedClass,
                        });
                        successCount++;
                    } catch (error: any) {
                        console.error("Error creating student:", error);
                        errorCount++;
                    }
                }

                if (successCount > 0) {
                    toast.success(`Successfully created ${successCount} students`);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
                if (errorCount > 0) {
                    toast.error(`Failed to create ${errorCount} students`);
                }
            } catch (error) {
                console.error("Error reading file:", error);
                toast.error("Failed to process file.");
            }
        };

        reader.onerror = () => {
            toast.error("Error reading the file.");
        };

        reader.readAsText(file);
    };

    input.click();
}
