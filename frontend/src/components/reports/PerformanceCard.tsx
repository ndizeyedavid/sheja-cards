"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClassPerformance } from "@/types/reports.types";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
} from "@tabler/icons-react";

interface PerformanceCardProps {
  performance: ClassPerformance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Students */}
          <div className="space-y-2 p-4 bg-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <IconUsers className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {performance.totalStudents}
            </p>
          </div>

          {/* Highest Percentage */}
          <div className="space-y-2 p-4 bg-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <IconTrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Highest</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {performance.highestPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              {performance.highestStudent}
            </p>
          </div>

          {/* Lowest Percentage */}
          <div className="space-y-2 p-4 bg-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <IconTrendingDown className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Lowest</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {performance.lowestPercentage.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">{performance.lowestStudent}</p>
          </div>

          {/* Average Percentage */}
          <div className="space-y-2 p-4 bg-primary/20 rounded-lg">
            <span className="text-sm font-medium">Class Average</span>
            <p className="text-2xl font-bold text-purple-600">
              {performance.averagePercentage.toFixed(1)}%
            </p>
            <Badge
              variant={
                performance.averagePercentage >= 70
                  ? "default"
                  : performance.averagePercentage >= 50
                  ? "secondary"
                  : "destructive"
              }
            >
              {performance.averagePercentage >= 70
                ? "Excellent"
                : performance.averagePercentage >= 50
                ? "Good"
                : "Needs Improvement"}
            </Badge>
          </div>

          {/* Performance Indicator */}
          <div className="space-y-2 p-4 bg-primary/20 rounded-lg">
            <span className="text-sm font-medium">Performance</span>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  performance.averagePercentage >= 70
                    ? "bg-green-500"
                    : performance.averagePercentage >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(performance.averagePercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs  mt-2">
              {performance.averagePercentage >= 70
                ? "Excellent performance"
                : performance.averagePercentage >= 50
                ? "Average performance"
                : "Below average"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
