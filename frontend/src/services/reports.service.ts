"use client";
import pb from "@/lib/pb";
import { StudentReport, ClassPerformance } from "@/types/reports.types";

export const fetchStudentReportsByClass = async (
  classId: string
): Promise<StudentReport[]> => {
  try {
    // Fetch all students in the class
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");
    console.log(classId);
    const students = await pb.collection("students").getFullList({
      filter: `school = "${schoolId}" && academicYear="${academicYear}" && isDeleted = false && Class="${classId}"`,
      expand: "class",
    });

    // Fetch all marks for these students
    const studentReports: StudentReport[] = [];

    for (const student of students) {
      const marks = await pb.collection("marks").getFullList({
        filter: `student = "${student.id}"`,
        expand: "subject",
      });

      // Group marks by subject and category
      const subjectMarksMap = new Map();

      marks.forEach((mark: any) => {
        const subjectId = mark.subject;
        const subjectName = mark.expand?.subject?.subjectName || "Unknown";

        if (!subjectMarksMap.has(subjectId)) {
          subjectMarksMap.set(subjectId, {
            subjectId,
            subjectName,
            cat: 0,
            exam: 0,
            total: 0,
          });
        }

        const subject = subjectMarksMap.get(subjectId);
        if (mark.category === "CAT") {
          subject.cat = mark.marksObtained || 0;
        } else if (mark.category === "EXAM") {
          subject.exam = mark.marksObtained || 0;
        }
        subject.total = subject.cat + subject.exam;
      });

      const subjects = Array.from(subjectMarksMap.values());
      const catTotal = subjects.reduce((sum, s) => sum + s.cat, 0);
      const examTotal = subjects.reduce((sum, s) => sum + s.exam, 0);
      const total = catTotal + examTotal;

      studentReports.push({
        id: student.id,
        name: student.name,
        classId: student.class,
        className: student.expand?.class?.name || "Unknown",
        catTotal,
        examTotal,
        total,
        position: 0, // Will be calculated after sorting
        subjects,
      });
    }

    // Sort by total marks (descending) and assign positions
    studentReports.sort((a, b) => b.total - a.total);
    studentReports.forEach((report, index) => {
      report.position = index + 1;
    });

    return studentReports;
  } catch (error) {
    console.error("Error fetching student reports:", error);
    return [];
  }
};

export const calculateClassPerformance = (
  reports: StudentReport[]
): ClassPerformance => {
  if (reports.length === 0) {
    return {
      className: "",
      totalStudents: 0,
      highestPercentage: 0,
      lowestPercentage: 0,
      averagePercentage: 0,
      highestStudent: "",
      lowestStudent: "",
    };
  }

  const maxMarks = reports[0].subjects.length * 200; // Assuming max 100 per subject (CAT + EXAM)
  const percentages = reports.map((r) => (r.total / maxMarks) * 100);

  const highest = Math.max(...percentages);
  const lowest = Math.min(...percentages);
  const average = percentages.reduce((a, b) => a + b, 0) / percentages.length;

  const highestStudent =
    reports.find((r) => (r.total / maxMarks) * 100 === highest)?.name || "";
  const lowestStudent =
    reports.find((r) => (r.total / maxMarks) * 100 === lowest)?.name || "";

  return {
    className: reports[0].className,
    totalStudents: reports.length,
    highestPercentage: highest,
    lowestPercentage: lowest,
    averagePercentage: average,
    highestStudent,
    lowestStudent,
  };
};
