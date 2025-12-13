import pb from "@/lib/pb";
import { createLog } from "./logs.service";

export interface StudentMark {
  studentId: string;
  studentName: string;
  cat: number;
  exam: number;
}

export interface MarkRecord {
  id: string;
  student: string;
  subject: string;
  marksObtained: number;
  category: "CAT" | "EXAM";
  created: string;
  updated: string;
}

/**
 * Initialize marks for all students in a class for a specific subject
 * Fetches existing marks from database if available
 */
export const initializeMarksForSubject = async (
  classId: string,
  subjectId: string
): Promise<StudentMark[]> => {
  const studentRecords = await pb.collection("students").getFullList({
    filter: `Class = "${classId}"`,
  });

  // Fetch existing marks for all students in this subject
  const existingMarks = await pb.collection("marks").getFullList({
    filter: `subject = "${subjectId}"`,
  });

  // Create a map for quick lookup of existing marks by student ID
  const marksMap = new Map<string, { cat: number; exam: number }>();

  existingMarks.forEach((mark: any) => {
    if (!marksMap.has(mark.student)) {
      marksMap.set(mark.student, { cat: 0, exam: 0 });
    }

    const studentMarks = marksMap.get(mark.student)!;
    if (mark.category === "CAT") {
      studentMarks.cat = mark.marksObtained;
    } else if (mark.category === "EXAM") {
      studentMarks.exam = mark.marksObtained;
    }
  });

  return studentRecords.map((student: any) => {
    const existingMark = marksMap.get(student.id) || { cat: 0, exam: 0 };
    return {
      studentId: student.id,
      studentName: student.name,
      cat: existingMark.cat,
      exam: existingMark.exam,
    };
  });
};

/**
 * Fetch existing marks for students in a subject
 */
export const fetchExistingMarks = async (
  subjectId: string,
  studentIds: string[]
): Promise<Map<string, MarkRecord[]>> => {
  const marksMap = new Map<string, MarkRecord[]>();

  for (const studentId of studentIds) {
    const marks = await pb.collection("marks").getFullList({
      filter: `student = "${studentId}" && subject = "${subjectId}"`,
    });

    marksMap.set(
      studentId,
      marks.map((mark: any) => ({
        id: mark.id,
        student: mark.student,
        subject: mark.subject,
        marksObtained: mark.marksObtained,
        category: mark.category,
        created: mark.created,
        updated: mark.updated,
      }))
    );
  }

  return marksMap;
};

/**
 * Save or update marks for a student in a subject
 */
export const saveStudentMarks = async (
  studentId: string,
  subjectId: string,
  catMarks: number,
  examMarks: number
): Promise<void> => {
  // Fetch student and subject details for logging
  const student = await pb.collection("students").getOne(studentId);
  const subject = await pb.collection("subjects").getOne(subjectId);

  // Fetch existing marks for this student and subject
  const existingMarks = await pb.collection("marks").getFullList({
    filter: `student = "${studentId}" && subject = "${subjectId}"`,
  });

  // Update or create CAT marks
  const catMarkRecord = existingMarks.find((m: any) => m.category === "CAT");
  if (catMarkRecord) {
    if (catMarks > 0) {
      await pb.collection("marks").update(catMarkRecord.id, {
        marksObtained: catMarks,
      });

      // Log CAT mark update
      await createLog({
        action: "MARK_UPDATED",
        description: `CAT marks updated for student "${student.name}" in subject "${subject.subjectName}" to ${catMarks}`,
        entityType: "marks",
        entityId: catMarkRecord.id,
        metadata: {
          studentName: student.name,
          studentId: studentId,
          subjectName: subject.subjectName,
          subjectId: subjectId,
          category: "CAT",
          marksObtained: catMarks,
          action: "UPDATE",
        },
      });
    } else {
      await pb.collection("marks").delete(catMarkRecord.id);

      // Log CAT mark deletion
      await createLog({
        action: "MARK_DELETED",
        description: `CAT marks deleted for student "${student.name}" in subject "${subject.subjectName}"`,
        entityType: "marks",
        entityId: catMarkRecord.id,
        metadata: {
          studentName: student.name,
          studentId: studentId,
          subjectName: subject.subjectName,
          subjectId: subjectId,
          category: "CAT",
          action: "DELETE",
        },
      });
    }
  } else if (catMarks > 0) {
    const newMark = await pb.collection("marks").create({
      student: studentId,
      subject: subjectId,
      marksObtained: catMarks,
      category: "CAT",
    });

    // Log CAT mark creation
    await createLog({
      action: "MARK_CREATED",
      description: `CAT marks recorded for student "${student.name}" in subject "${subject.subjectName}" with ${catMarks} marks`,
      entityType: "marks",
      entityId: newMark.id,
      metadata: {
        studentName: student.name,
        studentId: studentId,
        subjectName: subject.subjectName,
        subjectId: subjectId,
        category: "CAT",
        marksObtained: catMarks,
        action: "CREATE",
      },
    });
  }

  // Update or create EXAM marks
  const examMarkRecord = existingMarks.find((m: any) => m.category === "EXAM");
  if (examMarkRecord) {
    if (examMarks > 0) {
      await pb.collection("marks").update(examMarkRecord.id, {
        marksObtained: examMarks,
      });

      // Log EXAM mark update
      await createLog({
        action: "MARK_UPDATED",
        description: `EXAM marks updated for student "${student.name}" in subject "${subject.subjectName}" to ${examMarks}`,
        entityType: "marks",
        entityId: examMarkRecord.id,
        metadata: {
          studentName: student.name,
          studentId: studentId,
          subjectName: subject.subjectName,
          subjectId: subjectId,
          category: "EXAM",
          marksObtained: examMarks,
          action: "UPDATE",
        },
      });
    } else {
      await pb.collection("marks").delete(examMarkRecord.id);

      // Log EXAM mark deletion
      await createLog({
        action: "MARK_DELETED",
        description: `EXAM marks deleted for student "${student.name}" in subject "${subject.subjectName}"`,
        entityType: "marks",
        entityId: examMarkRecord.id,
        metadata: {
          studentName: student.name,
          studentId: studentId,
          subjectName: subject.subjectName,
          subjectId: subjectId,
          category: "EXAM",
          action: "DELETE",
        },
      });
    }
  } else if (examMarks > 0) {
    const newMark = await pb.collection("marks").create({
      student: studentId,
      subject: subjectId,
      marksObtained: examMarks,
      category: "EXAM",
    });

    // Log EXAM mark creation
    await createLog({
      action: "MARK_CREATED",
      description: `EXAM marks recorded for student "${student.name}" in subject "${subject.subjectName}" with ${examMarks} marks`,
      entityType: "marks",
      entityId: newMark.id,
      metadata: {
        studentName: student.name,
        studentId: studentId,
        subjectName: subject.subjectName,
        subjectId: subjectId,
        category: "EXAM",
        marksObtained: examMarks,
        action: "CREATE",
      },
    });
  }
};

/**
 * Batch save marks for multiple students
 */
export const batchSaveMarks = async (
  marks: StudentMark[],
  subjectId: string
): Promise<void> => {
  for (const mark of marks) {
    await saveStudentMarks(mark.studentId, subjectId, mark.cat, mark.exam);
  }
};

/**
 * Delete all marks for a student in a subject
 */
export const deleteStudentMarks = async (
  studentId: string,
  subjectId: string
): Promise<void> => {
  // Fetch student and subject details for logging
  const student = await pb.collection("students").getOne(studentId);
  const subject = await pb.collection("subjects").getOne(subjectId);

  const marks = await pb.collection("marks").getFullList({
    filter: `student = "${studentId}" && subject = "${subjectId}"`,
  });

  for (const mark of marks) {
    await pb.collection("marks").delete(mark.id);

    // Log mark deletion
    await createLog({
      action: "MARK_DELETED",
      description: `${mark.category} marks deleted for student "${student.name}" in subject "${subject.subjectName}"`,
      entityType: "marks",
      entityId: mark.id,
      metadata: {
        studentName: student.name,
        studentId: studentId,
        subjectName: subject.subjectName,
        subjectId: subjectId,
        category: mark.category,
        marksObtained: mark.marksObtained,
        action: "DELETE",
      },
    });
  }
};

/**
 * Get marks statistics for a subject
 */
export const getSubjectMarkStatistics = async (
  subjectId: string
): Promise<{
  totalStudents: number;
  averageCAT: number;
  averageEXAM: number;
  averageTotal: number;
  highestTotal: number;
  lowestTotal: number;
}> => {
  const marks = await pb.collection("marks").getFullList({
    filter: `subject = "${subjectId}"`,
  });

  const studentTotals = new Map<string, { cat: number; exam: number }>();

  marks.forEach((mark: any) => {
    const current = studentTotals.get(mark.student) || { cat: 0, exam: 0 };
    if (mark.category === "CAT") {
      current.cat = mark.marksObtained;
    } else if (mark.category === "EXAM") {
      current.exam = mark.marksObtained;
    }
    studentTotals.set(mark.student, current);
  });

  const totals = Array.from(studentTotals.values()).map((m) => m.cat + m.exam);

  return {
    totalStudents: studentTotals.size,
    averageCAT:
      marks
        .filter((m: any) => m.category === "CAT")
        .reduce((sum: number, m: any) => sum + m.marksObtained, 0) /
        (studentTotals.size || 1) || 0,
    averageEXAM:
      marks
        .filter((m: any) => m.category === "EXAM")
        .reduce((sum: number, m: any) => sum + m.marksObtained, 0) /
        (studentTotals.size || 1) || 0,
    averageTotal: totals.reduce((a, b) => a + b, 0) / (totals.length || 1) || 0,
    highestTotal: Math.max(...totals, 0),
    lowestTotal: Math.min(...totals, 0),
  };
};
