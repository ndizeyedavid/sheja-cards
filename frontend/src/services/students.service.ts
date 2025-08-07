"use client";

import pb from "@/lib/pb";
import { Students } from "@/types/student.types";

export const recentStudents = async () => {
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");
    const recent = await pb.collection("students").getList(1, 5, {
        filter: `school="${schoolId}"&& academicYear="${academicYear}"`,
        expand: "class",
    });

    return recent;
};

export const fetchStudents = async (selectedClass: string) => {
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");
    console.log(selectedClass);
    const res = await pb.collection("students").getFullList({
        filter: `school = "${schoolId}" && academicYear="${academicYear}" && isDeleted = false`,
    });
    return res;
};

export const createStudent = async (body: Students) => {
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");
    const res = await pb
        .collection("students")
        .create({ ...body, school: schoolId, academicYear });
    return res;
};

export const updateStudent = async (id: string, body: Partial<Students>) => {
    const schoolId = pb.authStore.record?.school;
    const res = await pb.collection("students").update(id, { ...body, school: schoolId });
    return res;
};

export const deleteStudent = async (id: string) => {
    await pb.collection("students").delete(id);
};

export const getStudent = async (id: string) => {
    const res = await pb.collection("students").getOne(id);
    return res;
};
