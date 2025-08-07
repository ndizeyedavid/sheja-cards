"use client";
import pb from "@/lib/pb";

export const getAnalytics = async () => {
  const schoolId = pb.authStore.record?.school;
  const academicYear = localStorage.getItem("academicYear");

  const studentCount = await pb
    .collection("students")
    .getFullList({
      filter: `school="${schoolId}" && academicYear="${academicYear}"`,
    });
  const staffCount = await pb
    .collection("staff")
    .getFullList({ filter: `school="${schoolId}"` });
  const classCount = await pb
    .collection("classes")
    .getFullList({
      filter: `school="${schoolId}" && academicYear="${academicYear}"`,
    });
  return { studentCount, staffCount, classCount };
};
