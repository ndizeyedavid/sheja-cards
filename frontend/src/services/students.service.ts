"use client";

import pb from "@/lib/pb";

export const recentStudents = async () => {
  const schoolId = pb.authStore.record?.school;
  const academicYear = localStorage.getItem("academicYear");
  const recent = await pb.collection("students").getList(1, 5, {
    filter: `school="${schoolId}"&& academicYear="${academicYear}"`,
    expand: "class",
  });

  return recent;
};
