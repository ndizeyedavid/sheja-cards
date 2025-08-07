"use client";
import ClassesTable from "@/components/tables/ClassesTable";

export default function page() {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="grid gap-4 px-4 lg:px-6">
                <ClassesTable />
            </div>
        </div>
    );
}
