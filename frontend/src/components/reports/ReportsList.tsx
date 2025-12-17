"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { StudentReport } from "@/types/reports.types";
import StudentReportRow from "./StudentReportRow";
import StudentReportsTable from "./StudentReportsTable";
import { useRef, useState } from "react";
import StudentReportModal from "./StudentReportModal";
import ReportPrintDialog from "./ReportPrintDialog";
import { IconList, IconTable, IconPrinter } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReportPrintTemplate from "./ReportPrintTemplate";

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
  const [isGeneratingClass, setIsGeneratingClass] = useState(false);
  const batchPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = (report: StudentReport) => {
    setReportToPrint(report);
    setShowPrintDialog(true);
  };

  const handleView = (report: StudentReport) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handlePrintClass = async () => {
    if (!batchPrintRef.current || reports.length === 0) return;
    setIsGeneratingClass(true);
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const wrappers = Array.from(
        batchPrintRef.current.querySelectorAll("[data-report-print-item]")
      ) as HTMLElement[];

      for (let i = 0; i < wrappers.length; i++) {
        const el = wrappers[i];
        const originalStyles = new Map<HTMLElement, string>();
        const COLOR_FN_REGEX =
          /(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi;
        el.querySelectorAll("*").forEach((node) => {
          const element = node as HTMLElement;
          const style = element.getAttribute("style");
          if (style && COLOR_FN_REGEX.test(style)) {
            originalStyles.set(element, style);
            const cleaned = style
              .replace(COLOR_FN_REGEX, "#000000")
              .replace(
                /background:\s*(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi,
                "background: #ffffff"
              )
              .replace(
                /color:\s*(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi,
                "color: #000000"
              );
            element.setAttribute("style", cleaned);
          }
        });

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          allowTaint: false,
          foreignObjectRendering: false,
          onclone: (clonedDoc) => {
            clonedDoc.querySelectorAll("*").forEach((n) => {
              n.removeAttribute("class");
            });
            const styleEl = clonedDoc.createElement("style");
            styleEl.setAttribute("data-html2canvas-fallback", "true");
            styleEl.textContent =
              ":root{--background:#ffffff;--foreground:#000000;--card:#ffffff;--card-foreground:#000000;--popover:#ffffff;--popover-foreground:#000000;--primary:#000000;--primary-foreground:#ffffff;--secondary:#cccccc;--secondary-foreground:#000000;--muted:#dddddd;--muted-foreground:#333333;--accent:#eeeeee;--accent-foreground:#111111;--destructive:#ff0000;--border:#000000;--input:#000000;--ring:#000000;--chart-1:#000000;--chart-2:#444444;--chart-3:#777777;--chart-4:#aaaaaa;--chart-5:#cccccc;--sidebar:#ffffff;--sidebar-foreground:#000000;--sidebar-primary:#000000;--sidebar-primary-foreground:#ffffff;--sidebar-accent:#eeeeee;--sidebar-accent-foreground:#111111;--sidebar-border:#000000;--sidebar-ring:#000000;}";
            clonedDoc.head.appendChild(styleEl);
          },
        });

        originalStyles.forEach((originalStyle, element) => {
          element.setAttribute("style", originalStyle);
        });

        const A4_WIDTH = 210;
        const A4_HEIGHT = 297;
        const pageW = A4_WIDTH - 10;
        const pageH = A4_HEIGHT - 10;
        const imgData = canvas.toDataURL("image/png");
        const imgHeightByWidth = (canvas.height * pageW) / canvas.width;
        if (imgHeightByWidth <= pageH) {
          pdf.addImage(imgData, "PNG", 5, 5, pageW, imgHeightByWidth);
        } else {
          const wByHeight = (canvas.width * pageH) / canvas.height;
          const x = (A4_WIDTH - wByHeight) / 2;
          pdf.addImage(imgData, "PNG", x, 5, wByHeight, pageH);
        }
        if (i < wrappers.length - 1) pdf.addPage();
      }

      pdf.save(`Class_Reports_${new Date().getTime()}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingClass(false);
    }
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

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintClass}
              disabled={isGeneratingClass}
              className="gap-2"
            >
              <IconPrinter className="h-4 w-4" />
              {isGeneratingClass ? "Printing..." : "Print Class"}
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
          name: "SHEJA Cards",
          province: "KIGALI CITY",
          district: "KICUKIRO",
          poBox: "3806",
          phone: "0784605269",
          email: "info@sheja.edu.rw",
        }}
      />

      <div
        ref={batchPrintRef}
        style={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          backgroundColor: "#ffffff",
          padding: "16px",
          width: "800px",
        }}
      >
        {reports.map((r) => (
          <div key={r.id} data-report-print-item>
            <ReportPrintTemplate
              report={r}
              schoolName={"SHEJA Cards"}
              schoolInfo={{
                district: "KICUKIRO",
                poBox: "3806",
                phone: "0784605269",
                email: "info@sheja.edu.rw",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
