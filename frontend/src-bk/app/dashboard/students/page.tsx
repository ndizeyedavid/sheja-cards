"use client";

import { useState } from "react";
import Filtercard from "@/components/cards/Filtercard";
import StudentsTable from "@/components/tables/StudentsTable";

// Mock data
const academicYears = ["2024", "2023", "2022"];
const classes = ["Form 1", "Form 2", "Form 3", "Form 4"];
const students = [
  {
    id: 1,
    name: "John Doe",
    class: "Form 1",
    academicYear: "2024",
    gender: "Male",
    status: "Active",
    email: "john@example.com",
    avatar: "/avatars/01.png",
  },
  // Add more students...
];

export default function page() {
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedClass, setSelectedClass] = useState<string>("Form 1");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        {/* Filter Card */}
        <Filtercard
          academicYears={academicYears}
          classes={classes}
          setIsLoading={setIsLoading}
          setIsFiltered={setIsFiltered}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
        {/* Results Area */}

        <StudentsTable
          students={students}
          isFiltered={isFiltered}
          selectedYear={selectedYear}
          selectedClass={selectedClass}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
