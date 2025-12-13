"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentReport } from "@/types/reports.types";
import {
  IconPrinter,
  IconDotsVertical,
  IconDownload,
  IconMail,
  IconEye,
} from "@tabler/icons-react";
import { toast } from "sonner";

interface StudentReportRowProps {
  report: StudentReport;
  onPrint: (report: StudentReport) => void;
  onView: (report: StudentReport) => void;
}

export default function StudentReportRow({
  report,
  onPrint,
  onView,
}: StudentReportRowProps) {
  const getPositionBadgeVariant = (position: number) => {
    if (position === 1) return "default";
    if (position <= 3) return "secondary";
    return "outline";
  };

  const getPercentage = () => {
    const maxMarks = report.subjects.length * 200;
    return ((report.total / maxMarks) * 100).toFixed(1);
  };

  const handleDownload = () => {
    toast.success("Report download started");
    // TODO: Implement download functionality
  };

  const handleEmail = () => {
    toast.success("Report sent to email");
    // TODO: Implement email functionality
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-primary/10 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        {/* Position */}
        <div className="w-12 text-center">
          <Badge
            variant={getPositionBadgeVariant(report.position)}
            className="text-lg"
          >
            #{report.position}
          </Badge>
        </div>

        {/* Student Info */}
        <div className="flex-1">
          <p className="font-semibold">{report.name}</p>
          <p className="text-sm ">{report.className}</p>
        </div>

        {/* Marks */}
        <div className="grid grid-cols-3 gap-6 min-w-max">
          <div className="text-center">
            <p className="text-xs">CAT</p>
            <p className="text-lg font-semibold text-blue-600">
              {report.catTotal}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs">EXAM</p>
            <p className="text-lg font-semibold text-green-600">
              {report.examTotal}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs">TOTAL</p>
            <p className="text-lg font-semibold text-purple-600">
              {report.total}
            </p>
          </div>
        </div>

        {/* Percentage */}
        <div className="text-center min-w-max">
          <p className="text-xs">Percentage</p>
          <p className="text-lg font-semibold">{getPercentage()}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPrint(report)}
          title="Print Report"
        >
          <IconPrinter className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(report)}>
              <IconEye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>
              <IconDownload className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEmail}>
              <IconMail className="h-4 w-4 mr-2" />
              Send via Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
