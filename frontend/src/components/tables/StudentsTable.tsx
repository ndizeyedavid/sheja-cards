import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBooks,
  IconUserCircle,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconSearch,
  IconUserPlus,
  IconUpload,
  IconPrinter,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, Dispatch, SetStateAction } from "react";
import { Students } from "@/types/student.types";
import Loading from "./Loading";
import { AddStudentModal } from "../students/AddStudentModal";
import { UpdateStudentModal } from "../students/UpdateStudentModal";
import { ViewStudentModal } from "../students/ViewStudentModal";
import { deleteStudent } from "@/services/students.service";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { IconDownload } from "@tabler/icons-react";
import { generateTemplate } from "./excel/Template";
import { handleTemplate } from "./excel/UploadTemplate";
import pb from "@/lib/pb";
import { Camera, Image, Smartphone } from "lucide-react";
import { UploadImagesModal } from "../students/UploadImagesModal";
import { CameraModal } from "../students/CameraModal";
import { RealtimeStudentModal } from "../students/RealtimeStudentModal";

interface StudentsTableProps {
  students: Students[];
  isFiltered: boolean;
  selectedClass: string;
  isLoading: boolean;
  setStudents: React.Dispatch<React.SetStateAction<Students[]>>;
}

export default function StudentsTable({
  students,
  isFiltered,
  selectedClass,
  isLoading,
  setStudents,
}: StudentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // return console.log(students);

  const filteredStudents = isFiltered
    ? students.filter(
        (student: any) =>
          student.expand.Class.name + " " + student.expand.Class.combination ===
            selectedClass &&
          (searchQuery === "" ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleAddStudent = (newStudent: Students) => {
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Students) => {
    setStudents(
      students.map((student: Students) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      setStudents(students.filter((student) => student.id !== studentId));
      toast.success("Student deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  const openImageUploader = async (selectedClass: string) => {};

  return (
    <>
      {!isFiltered ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <IconBooks className="h-16 w-16 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Select an academic year and class to view students
          </p>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Student List - {selectedClass}
            </CardTitle>
            <Badge variant="secondary">
              {!isLoading
                ? `${filteredStudents.length} students`
                : "Loading..."}
            </Badge>
          </CardHeader>
          <CardContent>
            <div
              className="mb-4 flex items-center justify-between"
              id="no-print"
            >
              <div className="relative flex-1 w-full max-w-sm">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  type="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>

              <div className="flex items-center">
                <CameraModal
                  selectedClass={selectedClass}
                  onAddStudent={handleAddStudent}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-4">
                      <IconUpload className="mr-2 h-4 w-4" />
                      Bulk add
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <RealtimeStudentModal
                        selectedClass={selectedClass}
                        onStudentUpdated={(updatedStudent) => {
                          setStudents((prev: Students[]) => {
                            return [...prev, updatedStudent];
                          });
                        }}
                      >
                        <div className="flex items-center w-full px-2.5 py-1.5 text-sm hover:bg-primary rounded cursor-default">
                          <Smartphone className="mr-3.5 h-4 w-4 opacity-60" />
                          <span>Realtime Creation</span>
                        </div>
                      </RealtimeStudentModal>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <UploadImagesModal
                        selectedClass={selectedClass}
                        onAddStudents={(newStudents) => {
                          setStudents((prev: Students[]) => [
                            ...prev,
                            ...newStudents,
                          ]);
                        }}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => generateTemplate(selectedClass)}
                    >
                      <IconDownload className="mr-2 h-4 w-4" />
                      Download Excel Template
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleTemplate(selectedClass)}
                    >
                      <IconUpload className="mr-2 h-4 w-4" />
                      Upload Students From Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AddStudentModal
                  onAddStudent={handleAddStudent}
                  selectedClass={selectedClass}
                />
                <Button className="ml-4" onClick={() => window.print()}>
                  <IconPrinter className="size-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reg No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date Of Birth</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeletons
                    <Loading category="default" />
                  ) : (
                    filteredStudents.map((student: Students) => (
                      <TableRow key={student.id}>
                        {/* console.log(student) */}
                        <TableCell>{student.registrationNumber}</TableCell>
                        <TableCell className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={pb.files.getURL(
                                student,
                                student.profileImage
                              )}
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name
                                .split(" ")
                                .map((n: any) => n[0])

                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.gender}</TableCell>
                        <TableCell>
                          {student.dateOfBirth
                            ? new Date(student.dateOfBirth).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {student.expand?.Class?.name +
                            " " +
                            student.expand?.Class?.combination}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={student.status} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <IconDotsVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <ViewStudentModal student={student} />
                              <UpdateStudentModal
                                student={student}
                                onUpdateStudent={handleUpdateStudent}
                              />
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
