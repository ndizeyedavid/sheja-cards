"use client";
import pb from "@/lib/pb";
import { Classes } from "@/types/classes.types";
import { createLog } from "./logs.service";
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

  const res = await pb
    .collection("classes")
    .create({ ...body, school: schoolId });

  // Log the class creation
  await createLog({
    action: "CLASS_CREATED",
    description: `Class "${body.name} ${body.combination}" was created`,
    entityType: "class",
    entityId: res.id,
    metadata: {
      className: `${body.name} ${body.combination}`,
      academicYear: body.academicYear,
    },
  });

  return {
    id: res.id,
    name: res.name,
    combination: res.combination,
    academicYear: res.academicYear
  };
};

export const fetchClasses = async (): Promise<Classes[]> => {
  const schoolId = pb.authStore.record?.school;
  const academicYear = localStorage.getItem("academicYear");
  const res = await pb.collection("classes").getFullList({
    filter: `school = "${schoolId}" && academicYear="${academicYear}" && isDeleted = false`,
  });
  return res.map(classData => ({
    id: classData.id,
    name: classData.name,
    combination: classData.combination,
    academicYear: classData.academicYear
  }));
};

export const deleteClass = async (id: string) => {
  const classData = await pb.collection("classes").getOne(id);
  await pb.collection("classes").update(id, {
    isDeleted: true,
  });

  // Log the class deletion
  await createLog({
    action: "CLASS_DELETED",
    description: `Class "${classData.name} ${classData.combination}" was deleted`,
    entityType: "class",
    entityId: id,
    metadata: {
      className: `${classData.name} ${classData.combination}`,
      academicYear: classData.academicYear,
    },
  });

  return true;
};

export const updateClass = async (id: string, body: any) => {
  const updatedData = await pb.collection("classes").update(id, body);

  // Log the class update
  await createLog({
    action: "CLASS_UPDATED",
    description: `Class "${updatedData.name} ${updatedData.combination}" was updated`,
    entityType: "class",
    entityId: id,
    metadata: {
      className: `${updatedData.name} ${updatedData.combination}`,
      updatedFields: Object.keys(body),
    },
  });

  return {
    id: updatedData.id,
    name: updatedData.name,
    combination: updatedData.combination,
    academicYear: updatedData.academicYear
  };
};
