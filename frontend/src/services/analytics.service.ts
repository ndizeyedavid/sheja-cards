"use client";
import pb from "@/lib/pb";

export const getAnalytics = async () => {
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");

    const studentCount = await pb.collection("students").getFullList({
        filter: `school="${schoolId}" && academicYear="${academicYear}" && isDeleted = false`,
    });
    const staffCount = await pb
        .collection("staff")
        .getFullList({ filter: `school="${schoolId}" && isDeleted = false` });
    const classCount = await pb.collection("classes").getFullList({
        filter: `school="${schoolId}" && academicYear="${academicYear}" && isDeleted = false`,
    });

    const deletedStudents = await pb.collection("students").getFullList({
        filter: `school="${schoolId}" && academicYear="${academicYear}" && isDeleted = true`,
    });
    const deletedClasses = await pb.collection("classes").getFullList({
        filter: `school="${schoolId}" && academicYear="${academicYear}" && isDeleted = true`,
    });
    return { studentCount, staffCount, classCount, deletedStudents, deletedClasses };
};
