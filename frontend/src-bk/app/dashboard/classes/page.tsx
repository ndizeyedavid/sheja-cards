"use client";

import { useState } from "react";
import ClassesTable from "@/components/tables/ClassesTable";

const classes = [
  {
    id: 1,
    name: "L3",
    combination: "SOD",
    academicYear: "2024",
  },
];

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
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <ClassesTable classes={classes} />
      </div>
    </div>
  );
}
