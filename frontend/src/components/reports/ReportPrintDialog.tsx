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
      const COLOR_FN_REGEX = /(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi;
      printRef.current.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement;
        const style = element.getAttribute("style");
        if (style && COLOR_FN_REGEX.test(style)) {
          originalStyles.set(element, style);
          const cleanedStyle = style
            .replace(COLOR_FN_REGEX, "#000000")
            .replace(/background:\s*(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi, "background: #ffffff")
            .replace(/color:\s*(lab|oklab|oklch|lch|color|color-mix)\([^)]*\)/gi, "color: #000000");
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
          const styleEl = clonedDoc.createElement("style");
          styleEl.setAttribute("data-html2canvas-fallback", "true");
          styleEl.textContent = 
            ":root{--background:#ffffff;--foreground:#000000;--card:#ffffff;--card-foreground:#000000;--popover:#ffffff;--popover-foreground:#000000;--primary:#000000;--primary-foreground:#ffffff;--secondary:#cccccc;--secondary-foreground:#000000;--muted:#dddddd;--muted-foreground:#333333;--accent:#eeeeee;--accent-foreground:#111111;--destructive:#ff0000;--border:#000000;--input:#000000;--ring:#000000;--chart-1:#000000;--chart-2:#444444;--chart-3:#777777;--chart-4:#aaaaaa;--chart-5:#cccccc;--sidebar:#ffffff;--sidebar-foreground:#000000;--sidebar-primary:#000000;--sidebar-primary-foreground:#ffffff;--sidebar-accent:#eeeeee;--sidebar-accent-foreground:#111111;--sidebar-border:#000000;--sidebar-ring:#000000;}\nbody{background:#ffffff !important;}\n*{background-image:none !important;}";
          clonedDoc.head.appendChild(styleEl);
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
