"use client";

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

// Mock data - replace with real data
const data = [
  {
    class: "Class 1",
    male: 40,
    female: 35,
  },
  {
    class: "Class 2",
    male: 45,
    female: 42,
  },
  {
    class: "Class 3",
    male: 38,
    female: 40,
  },
  {
    class: "Class 4",
    male: 42,
    female: 38,
  },
];

export function StudentDistribution() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Student Distribution</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="class" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="male" name="Male" fill="#2563eb" />
            <Bar dataKey="female" name="Female" fill="#ec4899" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
