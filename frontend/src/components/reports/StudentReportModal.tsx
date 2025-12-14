"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StudentReport } from "@/types/reports.types";
import { Button } from "@/components/ui/button";
import { IconPrinter, IconDownload } from "@tabler/icons-react";

interface StudentReportModalProps {
  report: StudentReport;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StudentReportModal({
  report,
  open,
  onOpenChange,
}: StudentReportModalProps) {
  const getPercentage = () => {
    const maxMarks = report.subjects.length * 200;
    return ((report.total / maxMarks) * 100).toFixed(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{report.name}</DialogTitle>
          <DialogDescription>{report.className}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-primary/10 rounded-lg">
            <div>
              <p className="text-sm ">Position</p>
              <Badge className="text-lg mt-1">#{report.position}</Badge>
            </div>
            <div>
              <p className="text-sm ">Overall Percentage</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {getPercentage()}%
              </p>
            </div>
          </div>

          {/* Summary Marks */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border border-primary/50 rounded-lg text-center">
              <p className="text-sm ">CAT Total</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {report.catTotal}
              </p>
            </div>
            <div className="p-4 border border-primary/50 rounded-lg text-center">
              <p className="text-sm ">EXAM Total</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {report.examTotal}
              </p>
            </div>
            <div className="p-4 border border-primary/50 rounded-lg text-center">
              <p className="text-sm ">Grand Total</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                {report.total}
              </p>
            </div>
          </div>

          {/* Subject Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Subject Breakdown</h3>
            <div className="space-y-2">
              {report.subjects.map((subject) => (
                <div key={subject.subjectId} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.subjectName}</span>
                    <span className="text-sm ">{subject.total} marks</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                      <span className="">CAT: </span>
                      <span className="font-semibold">{subject.cat}</span>
                    </div>
                    <div>
                      <span className="">EXAM: </span>
                      <span className="font-semibold">{subject.exam}</span>
                    </div>
                    <div>
                      <span className="">Total: </span>
                      <span className="font-semibold">{subject.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" className="gap-2">
              <IconPrinter className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2">
              <IconDownload className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
