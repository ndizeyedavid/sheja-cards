"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StudentReport } from "@/types/reports.types";
import StudentReportRow from "./StudentReportRow";
import StudentReportsTable from "./StudentReportsTable";
import { useState } from "react";
import StudentReportModal from "./StudentReportModal";
import ReportPrintDialog from "./ReportPrintDialog";
import { IconList, IconTable } from "@tabler/icons-react";

interface ReportsListProps {
  reports: StudentReport[];
  isLoading: boolean;
}

export default function ReportsList({ reports, isLoading }: ReportsListProps) {
  const [selectedReport, setSelectedReport] = useState<StudentReport | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [reportToPrint, setReportToPrint] = useState<StudentReport | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "table">("table");

  const handlePrint = (report: StudentReport) => {
    setReportToPrint(report);
    setShowPrintDialog(true);
  };

  const handleView = (report: StudentReport) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-gray-500">No students found in this class</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Student Reports</CardTitle>
            <Badge variant="secondary">{reports.length} students</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <IconTable className="h-4 w-4" />
              Table
            </Button>

            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="gap-2"
            >
              <IconList className="h-4 w-4" />
              List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <div className="space-y-2">
              {reports.map((report) => (
                <StudentReportRow
                  key={report.id}
                  report={report}
                  onPrint={handlePrint}
                  onView={handleView}
                />
              ))}
            </div>
          ) : (
            <StudentReportsTable
              reports={reports}
              onPrint={handlePrint}
              onView={handleView}
            />
          )}
        </CardContent>
      </Card>

      {selectedReport && (
        <StudentReportModal
          report={selectedReport}
          open={showModal}
          onOpenChange={setShowModal}
        />
      )}

      <ReportPrintDialog
        isOpen={showPrintDialog}
        onClose={() => {
          setShowPrintDialog(false);
          setReportToPrint(null);
        }}
        report={reportToPrint}
        schoolInfo={{
          name: "SHEJA SCHOOL",
          province: "KIGALI CITY",
          district: "KICUKIRO",
          poBox: "3806",
          phone: "0784605269",
          email: "info@sheja.edu.rw",
        }}
      />
    </>
  );
}
