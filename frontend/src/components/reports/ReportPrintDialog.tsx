"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReportPrintTemplate } from "./ReportPrintTemplate";
import { StudentReport } from "@/types/reports.types";
import { IconX, IconDownload } from "@tabler/icons-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ReportPrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: StudentReport | null;
  schoolInfo?: {
    name?: string;
    province?: string;
    district?: string;
    poBox?: string;
    phone?: string;
    email?: string;
  };
}

export default function ReportPrintDialog({
  isOpen,
  onClose,
  report,
  schoolInfo,
}: ReportPrintDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleGeneratePDF = async () => {
    if (!printRef.current || !report) return;

    setIsGeneratingPDF(true);
    try {
      // Temporarily modify styles to avoid lab() colors
      const originalStyles = new Map<HTMLElement, string>();

      // Clean all inline styles that contain lab() colors
      printRef.current.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement;
        const style = element.getAttribute("style");
        if (style && (style.includes("lab(") || style.includes("color-mix("))) {
          originalStyles.set(element, style);
          const cleanedStyle = style
            .replace(/lab\([^)]*\)/g, "#000000")
            .replace(/color-mix\([^)]*\)/g, "#000000")
            .replace(/background:\s*lab\([^)]*\)/g, "background: #ffffff")
            .replace(/color:\s*lab\([^)]*\)/g, "color: #000000");
          element.setAttribute("style", cleanedStyle);
        }
      });

      // Create a canvas from the HTML element with high quality
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: false,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          // Remove classes in cloned document to avoid CSS issues
          clonedDoc.querySelectorAll("*").forEach((el) => {
            el.removeAttribute("class");
          });
        },
      });

      // Restore original styles
      originalStyles.forEach((originalStyle, element) => {
        element.setAttribute("style", originalStyle);
      });

      // A4 dimensions
      const A4_WIDTH = 210; // mm
      const A4_HEIGHT = 297; // mm

      // Create PDF with A4 size
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Get canvas dimensions
      const imgWidth = A4_WIDTH - 10; // 5mm margins on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Convert canvas to image data
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF, scaling to fit width with proper aspect ratio
      let yPosition = 5; // 5mm top margin
      pdf.addImage(imgData, "PNG", 5, yPosition, imgWidth, imgHeight);

      // If content is taller than one page, add additional pages
      if (imgHeight > A4_HEIGHT - 10) {
        let remainingHeight = imgHeight - (A4_HEIGHT - 10);
        let pageCount = 1;

        while (remainingHeight > 0) {
          pdf.addPage();
          pageCount++;
          const pageHeight = Math.min(remainingHeight, A4_HEIGHT - 10);
          const srcY = (pageCount - 1) * (A4_HEIGHT - 10);

          pdf.addImage(
            imgData,
            "PNG",
            5,
            5,
            imgWidth,
            imgHeight,
            undefined,
            "FAST",
            srcY
          );
          remainingHeight -= pageHeight;
        }
      }

      // Download the PDF
      pdf.save(`${report.name}_Report_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] sm:max-w-full! w-[80%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Print Student Report - {report.name}</DialogTitle>
        </DialogHeader>

        <div
          ref={printRef}
          className="bg-white p-4 rounded-lg"
          style={{
            fontFamily: "sans-serif",
          }}
        >
          <ReportPrintTemplate
            report={report}
            schoolName={schoolInfo?.name}
            schoolInfo={{
              district: schoolInfo?.district,
              poBox: schoolInfo?.poBox,
              phone: schoolInfo?.phone,
              email: schoolInfo?.email,
            }}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <IconX className="w-4 h-4" />
            Close
          </Button>
          <Button
            onClick={handleGeneratePDF}
            disabled={isGeneratingPDF}
            className="gap-2"
          >
            <IconDownload className="w-4 h-4" />
            {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
