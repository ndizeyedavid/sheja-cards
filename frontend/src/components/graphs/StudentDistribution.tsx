"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import pb from "@/lib/pb";
import { Loader2 } from "lucide-react";

interface Student {
  gender: "MALE" | "FEMALE";
  class: string;
  school: string;
  expand: {
    Class: {
      name: string;
      combination: string;
    };
  };
}

interface ChartData {
  class: string;
  male: number;
  female: number;
}

export function StudentDistribution() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDistribution = async () => {
      try {
        // Replace this with actual logged-in user's school ID
        const schoolId = pb.authStore.record?.school; // assumes school is a field on the logged-in user
        const academicYear = localStorage.getItem("academicYear");

        if (!schoolId || !academicYear) return;

        const students: Student[] = await pb
          .collection("students")
          .getFullList({
            filter: `school="${schoolId}" && academicYear="${academicYear}"`,
            expand: "Class",
            sort: "-created", // optional
          });

        const grouped: Record<string, { male: number; female: number }> = {};

        students.forEach((student) => {
          const className =
            student.expand.Class.name +
              " " +
              student.expand.Class.combination || "Unassigned";
          if (!grouped[className]) {
            grouped[className] = { male: 0, female: 0 };
          }
          if (student.gender === "MALE") {
            grouped[className].male++;
          } else if (student.gender === "FEMALE") {
            grouped[className].female++;
          }
        });

        const formatted: ChartData[] = Object.entries(grouped).map(
          ([className, { male, female }]) => ({
            class: className,
            male,
            female,
          })
        );

        setChartData(formatted);
      } catch (err) {
        console.error("Error loading student distribution:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDistribution();
  }, []);

  return (
    <Card className="col-span-4 w-full">
      <CardHeader>
        <CardTitle>Student Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {loading ? (
          <div className="flex justify-center items-center h-[350px]">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            <span className="ml-2 text-gray-500">Loading...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex justify-center items-center h-[350px] text-muted-foreground">
            No student distribution data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="class" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" name="Male" fill="#2563eb" />
              <Bar dataKey="female" name="Female" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
