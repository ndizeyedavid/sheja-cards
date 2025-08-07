"use client";

import { useState } from "react";
import Filtercard from "@/components/cards/Filtercard";
import StudentsTable from "@/components/tables/StudentsTable";

const classes = ["S1", "S2", "S3", "S4 ACC"];
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
  const [selectedClass, setSelectedClass] = useState<string>("-");
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        {/* Filter Card */}
        <Filtercard
          classes={classes}
          setIsLoading={setIsLoading}
          setIsFiltered={setIsFiltered}
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
