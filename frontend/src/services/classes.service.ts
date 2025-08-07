"use client";
import pb from "@/lib/pb";
import { toast } from "sonner";

export const createClass = async (body: any) => {
    const schoolId = pb.authStore.record?.school;
    // check if school exists
    const check = await pb.collection("classes").getFullList({
        filter: `school = "${schoolId}" && name = "${body.name}" && combination="${body.combination}" && academicYear = "${body.academicYear}"`,
    });
    if (check.length > 0) {
        toast.error("Class already exists");
        throw new Error("Class already exists");
    }

    const res = await pb.collection("classes").create({ ...body, school: schoolId });
    return res;
};

export const fetchClasses = async () => {
    const schoolId = pb.authStore.record?.school;
    const academicYear = localStorage.getItem("academicYear");
    const res = await pb.collection("classes").getFullList({
        filter: `school = "${schoolId}" && academicYear="${academicYear}" && isDeleted = false`,
    });
    return res;
};

export const deleteClass = async (id: string) => {
    await pb.collection("classes").update(id, {
        isDeleted: true,
    });
    return true;
};

export const updateClass = async (id: string, body: any) => {
    const updatedData = await pb.collection("classes").update(id, body);
    return updatedData;
};
