"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  IconBook,
  IconUsers,
  IconFileText,
  IconEdit,
  IconEye,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTeacherInfo,
  fetchTeacherClassesAndSubjects,
  fetchStudentsByClass,
  type TeacherInfo,
  type ClassInfo,
  type SubjectInfo,
  type StudentInfo,
} from "@/services/teacher.service";
import {
  initializeMarksForSubject,
  batchSaveMarks,
  type StudentMark,
} from "@/services/marks.service";
import { StudentDetailsModal } from "@/components/modals/StudentDetailsModal";
import { ClassDetailsModal } from "@/components/modals/ClassDetailsModal";
import { SubjectDetailsModal } from "@/components/modals/SubjectDetailsModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import pb from "@/lib/pb";

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [subjects, setSubjects] = useState<SubjectInfo[]>([]);
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [isSavingMarks, setIsSavingMarks] = useState(false);

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<StudentInfo | null>(
    null
  );
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] =
    useState<ClassInfo | null>(null);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [selectedSubjectForModal, setSelectedSubjectForModal] =
    useState<SubjectInfo | null>(null);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get teacher info
        const teacherData = getTeacherInfo();
        if (!teacherData) {
          toast.error("Failed to load teacher information");
          return;
        }
        setTeacher(teacherData);

        // Fetch classes and subjects
        const { classes: classesData, subjects: subjectsData } =
          await fetchTeacherClassesAndSubjects();
        // console.log(classesData);
        setClasses(classesData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId);
    setSelectedSubject("");
    setMarks([]);

    try {
      const studentsData = await fetchStudentsByClass(classId);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Failed to load students");
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubject(subjectId);

    try {
      const marksData = await initializeMarksForSubject(
        selectedClass,
        subjectId
      );
      setMarks(marksData);
    } catch (error) {
      console.error("Error loading marks:", error);
      toast.error("Failed to load marks");
    }
  };

  const handleMarkChange = (
    studentId: string,
    type: "cat" | "exam",
    value: number
  ) => {
    setMarks((prevMarks) =>
      prevMarks.map((mark) =>
        mark.studentId === studentId ? { ...mark, [type]: value } : mark
      )
    );
  };

  const handleSaveMarks = async () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    setIsSavingMarks(true);
    try {
      await batchSaveMarks(marks, selectedSubject);
      toast.success("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Failed to save marks");
    } finally {
      setIsSavingMarks(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {teacher?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage marks, view students, and track your classes
          </p>
        </div>

        {/* Tabs for Main Sections */}
        <Tabs defaultValue="marks" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="marks" className="gap-2">
              <IconFileText className="w-4 h-4" />
              <span className="hidden sm:inline">Marks Entry</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <IconUsers className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="gap-2">
              <IconBook className="w-4 h-4" />
              <span className="hidden sm:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="gap-2">
              <IconEdit className="w-4 h-4" />
              <span className="hidden sm:inline">Subjects</span>
            </TabsTrigger>
          </TabsList>

          {/* Marks Entry Tab */}
          <TabsContent value="marks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="w-5 h-5" />
                  Record Student Marks
                </CardTitle>
                <CardDescription>
                  Enter CAT and exam marks for your students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Class and Subject Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Class
                    </label>
                    <Select
                      value={selectedClass}
                      onValueChange={handleClassChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                            {cls.combination && ` (${cls.combination})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Subject
                    </label>
                    <Select
                      value={selectedSubject}
                      onValueChange={handleSubjectChange}
                      disabled={!selectedClass}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects
                          .filter((s) => s.assignedClass === selectedClass)
                          .map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.subjectName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Marks Table */}
                {marks.length > 0 && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="text-center">
                              CAT Marks
                            </TableHead>
                            <TableHead className="text-center">
                              Exam Marks
                            </TableHead>
                            <TableHead className="text-center">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {marks.map((mark) => (
                            <TableRow key={mark.studentId}>
                              <TableCell className="font-medium">
                                {mark.studentName}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={mark.cat}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      mark.studentId,
                                      "cat",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="text-center"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={mark.exam}
                                  onChange={(e) =>
                                    handleMarkChange(
                                      mark.studentId,
                                      "exam",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="text-center"
                                />
                              </TableCell>
                              <TableCell className="text-center font-semibold">
                                {mark.cat + mark.exam}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Button
                      onClick={handleSaveMarks}
                      disabled={isSavingMarks}
                      className="w-full"
                    >
                      {isSavingMarks ? "Saving..." : "Save Marks"}
                    </Button>
                  </div>
                )}

                {selectedClass && !selectedSubject && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Select a subject to begin entering marks</p>
                  </div>
                )}

                {!selectedClass && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Select a class first</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconUsers className="w-5 h-5" />
                  View Students
                </CardTitle>
                <CardDescription>
                  View all students in your classes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Select Class
                  </label>
                  <Select
                    value={selectedClass}
                    onValueChange={handleClassChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                          {cls.combination && ` (${cls.combination})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {students.length > 0 && (
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Photo</TableHead>
                          <TableHead>Reg Number</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              <Avatar>
                                <AvatarImage
                                  src={pb.files.getURL(
                                    student.fullStack[0],
                                    student.profileImage
                                  )}
                                  alt={student.name + "_photo"}
                                />
                                <AvatarFallback className="border-2">
                                  {student.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.registrationNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.gender}
                            </TableCell>
                            <TableCell>{student.status}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setStudentModalOpen(true);
                                }}
                              >
                                <IconEye className="w-4 h-4" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {selectedClass && students.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No students in this class</p>
                  </div>
                )}

                {!selectedClass && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Select a class to view students</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconBook className="w-5 h-5" />
                  Your Classes
                </CardTitle>
                <CardDescription>
                  View all your assigned classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {classes.length > 0 ? (
                  <div className="space-y-3">
                    {classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{classItem.name}</h3>
                            {classItem.combination && (
                              <p className="text-sm text-muted-foreground">
                                {classItem.combination}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              setSelectedClassForModal(classItem);
                              setClassModalOpen(true);
                            }}
                          >
                            <IconEye className="w-4 h-4" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No classes assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconEdit className="w-4 h-4" />
                  Your Subjects
                </CardTitle>
                <CardDescription>
                  View all your assigned subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subjects.length > 0 ? (
                  <div className="space-y-3">
                    {subjects.map((subject) => {
                      const classData = classes.find(
                        (c) => c.id === subject.assignedClass
                      );
                      return (
                        <div
                          key={subject.id + Math.random()}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">
                                {subject.subjectName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {classData?.name}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => {
                                setSelectedSubjectForModal(subject);
                                setSubjectModalOpen(true);
                              }}
                            >
                              <IconEye className="w-4 h-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No subjects assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={studentModalOpen}
          onClose={() => {
            setStudentModalOpen(false);
            setSelectedStudent(null);
          }}
        />

        <ClassDetailsModal
          classData={selectedClassForModal}
          isOpen={classModalOpen}
          onClose={() => {
            setClassModalOpen(false);
            setSelectedClassForModal(null);
          }}
        />

        <SubjectDetailsModal
          subject={selectedSubjectForModal}
          classData={
            selectedSubjectForModal
              ? classes.find(
                  (c) => c.id === selectedSubjectForModal.assignedClass
                ) || null
              : null
          }
          isOpen={subjectModalOpen}
          onClose={() => {
            setSubjectModalOpen(false);
            setSelectedSubjectForModal(null);
          }}
        />
      </div>
    </>
  );
}
