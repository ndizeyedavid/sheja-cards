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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import pb from "@/lib/pb";
import { toast } from "sonner";
import {
  IconFileText,
  IconPlus,
  IconDownload,
  IconCheck,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ClassInfo {
  id: string;
  name: string;
}

interface StudentMark {
  studentId: string;
  studentName: string;
  cat: number;
  exam: number;
}

export default function MarksPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.record) {
          const classRecords = await pb.collection("subjects").getFullList({
            filter: `assignedTeacher = "${pb.authStore.record.id}"`,
            expand: "assignedClass",
          });

          const uniqueClasses: { [key: string]: ClassInfo } = {};
          classRecords.forEach((subject: any) => {
            if (subject.expand?.assignedClass) {
              const classData = subject.expand.assignedClass;
              if (!uniqueClasses[classData.id]) {
                uniqueClasses[classData.id] = {
                  id: classData.id,
                  name: classData.name,
                };
              }
            }
          });

          setClasses(Object.values(uniqueClasses));
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };

    loadClasses();
  }, []);

  const handleClassChange = async (classId: string) => {
    setSelectedClass(classId);
    setSelectedSubject("");
    setMarks([]);

    try {
      const subjectRecords = await pb.collection("subjects").getFullList({
        filter: `assignedTeacher = "${pb.authStore.record?.id}" && assignedClass = "${classId}"`,
      });

      setSubjects(subjectRecords);
    } catch (error) {
      console.error("Error loading subjects:", error);
      toast.error("Failed to load subjects");
    }
  };

  const handleSubjectChange = async (subjectId: string) => {
    setSelectedSubject(subjectId);

    try {
      const studentRecords = await pb.collection("students").getFullList({
        filter: `Class = "${selectedClass}"`,
      });

      const marksData: StudentMark[] = studentRecords.map((student: any) => ({
        studentId: student.id,
        studentName: student.name,
        cat: 0,
        exam: 0,
      }));

      setMarks(marksData);
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Failed to load students");
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

    setIsSaving(true);
    try {
      for (const mark of marks) {
        // Check if mark already exists
        const existingMarks = await pb.collection("marks").getFullList({
          filter: `student = "${mark.studentId}" && subject = "${selectedSubject}"`,
        });

        if (existingMarks.length > 0) {
          // Update existing marks
          for (const existing of existingMarks) {
            if (existing.category === "CAT") {
              await pb.collection("marks").update(existing.id, {
                marksObtained: mark.cat,
              });
            } else if (existing.category === "EXAM") {
              await pb.collection("marks").update(existing.id, {
                marksObtained: mark.exam,
              });
            }
          }
        } else {
          // Create new marks
          if (mark.cat > 0) {
            await pb.collection("marks").create({
              student: mark.studentId,
              subject: selectedSubject,
              marksObtained: mark.cat,
              category: "CAT",
            });
          }
          if (mark.exam > 0) {
            await pb.collection("marks").create({
              student: mark.studentId,
              subject: selectedSubject,
              marksObtained: mark.exam,
              category: "EXAM",
            });
          }
        }
      }

      toast.success("Marks saved successfully!");
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Failed to save marks");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
        <Skeleton className="h-12 w-48 mb-8" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Record Marks</h1>
          <p className="text-muted-foreground">
            Enter and manage student marks for CAT and exams
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSubject}
                onValueChange={handleSubjectChange}
                disabled={!selectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Marks Table */}
        {marks.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="w-5 h-5" />
                  Student Marks
                </CardTitle>
                <CardDescription>
                  Enter CAT and exam marks for each student
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <IconDownload className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  onClick={handleSaveMarks}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <IconCheck className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Marks"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">CAT Marks</TableHead>
                      <TableHead className="text-center">Exam Marks</TableHead>
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
                            className="w-20 text-center"
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
                            className="w-20 text-center"
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
            </CardContent>
          </Card>
        )}

        {!selectedSubject && selectedClass && (
          <Card>
            <CardContent className="py-12 text-center">
              <IconFileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Select a subject to begin
              </h3>
              <p className="text-muted-foreground">
                Choose a subject from the dropdown above to start recording
                marks
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
