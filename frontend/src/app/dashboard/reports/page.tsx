"use client";
import { useState } from "react";
import ClassFilterCard from "@/components/reports/ClassFilterCard";
import PerformanceCard from "@/components/reports/PerformanceCard";
import ReportsList from "@/components/reports/ReportsList";
import {
  fetchStudentReportsByClass,
  calculateClassPerformance,
} from "@/services/reports.service";
import { StudentReport, ClassPerformance } from "@/types/reports.types";

export default function ReportsPage() {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [reports, setReports] = useState<StudentReport[]>([]);
  const [performance, setPerformance] = useState<ClassPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassSelect = async (classId: string) => {
    try {
      setIsLoading(true);
      setSelectedClassId(classId);
      const studentReports = await fetchStudentReportsByClass(classId);
      setReports(studentReports);
      const classPerformance = calculateClassPerformance(studentReports);
      setPerformance(classPerformance);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 md:gap-6 md:py-6">
      <div className="grid gap-4 px-4 lg:px-6">
        <h1 className="text-3xl font-bold">Student Reports</h1>
        <ClassFilterCard
          onClassSelect={handleClassSelect}
          isLoading={isLoading}
        />
      </div>

      {selectedClassId && (
        <div className="grid gap-4 px-4 lg:px-6">
          {performance && <PerformanceCard performance={performance} />}
          <ReportsList reports={reports} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
