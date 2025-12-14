"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentReport } from "@/types/reports.types";
import { IconPrinter, IconDotsVertical } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface StudentReportsTableProps {
  reports: StudentReport[];
  onPrint: (report: StudentReport) => void;
  onView: (report: StudentReport) => void;
}

export default function StudentReportsTable({
  reports,
  onPrint,
  onView,
}: StudentReportsTableProps) {
  const getSubjectColumnLabel = (
    subjectName: string,
    type: "CAT" | "EX" | "TOT"
  ) => {
    const prefix = subjectName.substring(0, 3).toUpperCase();
    return `${prefix}_${type}`;
  };

  const handleDownload = () => {
    toast.success("Report download started");
  };

  const handleEmail = () => {
    toast.success("Report sent to email");
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No students found in this class</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-x-auto scrollbar-visible">
      <Table>
        <TableHeader>
          {/* Subject Names Row */}
          <TableRow className=" border-b-2">
            <TableHead className="w-12 text-center sticky left-0 z-10"></TableHead>
            <TableHead className="min-w-[150px] sticky left-12 z-10"></TableHead>
            {reports[0].subjects.map((subject) => (
              <TableHead
                key={`${subject.subjectId}-header`}
                colSpan={3}
                className="text-center font-bold text-sm border-r border-dashed border-white"
              >
                {subject.subjectName}
              </TableHead>
            ))}
            <TableHead
              colSpan={3}
              className="text-center font-bold text-sm border-r border-dashed border-white"
            >
              Totals
            </TableHead>
            <TableHead className="text-center font-bold text-sm border-r border-dashed border-white">
              %
            </TableHead>
            <TableHead className="text-center min-w-[100px] sticky right-0 z-10 bg-primary">
              Actions
            </TableHead>
          </TableRow>

          {/* Mark Type Row */}
          <TableRow className="">
            <TableHead className="w-12 text-center sticky left-0 z-10 bg-gray-800">
              Pos
            </TableHead>
            <TableHead className="min-w-[150px] sticky left-12 z-10 bg-gray-800">
              Student Name
            </TableHead>
            {reports[0].subjects.map((subject) => (
              <>
                <TableHead
                  key={`${subject.subjectId}-cat`}
                  className="text-center min-w-[60px] text-xs"
                >
                  CAT
                </TableHead>
                <TableHead
                  key={`${subject.subjectId}-ex`}
                  className="text-center min-w-[60px] text-xs"
                >
                  EX
                </TableHead>
                <TableHead
                  key={`${subject.subjectId}-tot`}
                  className="text-center min-w-[60px] text-xs border-r border-dashed border-white"
                >
                  TOT
                </TableHead>
              </>
            ))}
            <TableHead className="text-center min-w-[80px] text-xs">
              CAT
            </TableHead>
            <TableHead className="text-center min-w-[80px] text-xs">
              EXAM
            </TableHead>
            <TableHead className="text-center min-w-[80px] text-xs border-r border-dashed border-white">
              TOTAL
            </TableHead>
            <TableHead className="text-center min-w-[60px] text-xs border-r border-dashed border-white">
              %
            </TableHead>
            <TableHead className="text-center min-w-[100px] sticky right-0 z-10 bg-primary">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const maxMarks = report.subjects.length * 200;
            const percentage = ((report.total / maxMarks) * 100).toFixed(1);

            return (
              <TableRow key={report.id} className="hover:bg-primary/5">
                <TableCell className="text-center font-semibold sticky left-0 z-10 bg-gray-800">
                  <Badge variant="outline">#{report.position}</Badge>
                </TableCell>
                <TableCell className="font-medium sticky left-12 z-10 bg-gray-800">
                  {report.name}
                </TableCell>

                {/* Render CAT, EX, TOT for each subject in order */}
                {report.subjects.map((subject) => (
                  <>
                    <TableCell
                      key={`${report.id}-${subject.subjectId}-cat`}
                      className="text-center font-semibold text-blue-600"
                    >
                      {subject.cat}
                    </TableCell>
                    <TableCell
                      key={`${report.id}-${subject.subjectId}-ex`}
                      className="text-center font-semibold text-green-600"
                    >
                      {subject.exam}
                    </TableCell>
                    <TableCell
                      key={`${report.id}-${subject.subjectId}-tot`}
                      className="text-center font-semibold text-purple-600 border-r border-dashed border-white"
                    >
                      {subject.total}
                    </TableCell>
                  </>
                ))}

                <TableCell className="text-center font-semibold text-blue-600">
                  {report.catTotal}
                </TableCell>
                <TableCell className="text-center font-semibold text-green-600">
                  {report.examTotal}
                </TableCell>
                <TableCell className="text-center font-semibold text-purple-600 border-r border-dashed border-white">
                  {report.total}
                </TableCell>
                <TableCell className="text-center font-semibold border-r border-dashed border-white">
                  {percentage}%
                </TableCell>

                <TableCell className="text-center sticky right-0 z-10 bg-primary">
                  <div className="flex items-center justify-center gap-1">
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownload}>
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEmail}>
                          Send via Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
