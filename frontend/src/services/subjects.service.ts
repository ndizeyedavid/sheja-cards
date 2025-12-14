"use client";
import pb from "@/lib/pb";
import { Subject } from "@/types/subjects.types";
import { createLog } from "./logs.service";
import { toast } from "sonner";

export const createSubject = async (body: any) => {
  const schoolId = pb.authStore.record?.school;
  // check if subject exists
  const check = await pb.collection("subjects").getFullList({
    filter: `subjectCode = "${body.subjectCode}" && subjectName = "${body.subjectName}"`,
  });
  if (check.length > 0) {
    toast.error("Subject already exists");
    throw new Error("Subject already exists");
  }

  const res = await pb
    .collection("subjects")
    .create(
      { ...body, school: schoolId },
      { expand: "assignedTeacher,assignedClass" }
    );

  // Log the subject creation
  await createLog({
    action: "SUBJECT_CREATED",
    description: `Subject "${body.subjectName}" (${body.subjectCode}) was created`,
    entityType: "subject",
    entityId: res.id,
    metadata: {
      subjectName: body.subjectName,
      subjectCode: body.subjectCode,
      subjectCredit: body.subjectCredit,
    },
  });

  return {
    id: res.id,
    subjectCode: res.subjectCode,
    subjectName: res.subjectName,
    assignedTeacher: res.expand?.assignedTeacher,
    subjectCredit: res.subjectCredit,
    assignedClass: res.expand?.assignedClass,
  };
};

export const fetchSubjects = async (): Promise<Subject[]> => {
  const res = await pb.collection("subjects").getFullList({
    expand: "assignedTeacher,assignedClass,assignedClass.school",
  });
  return res.map((subjectData) => ({
    id: subjectData.id,
    subjectCode: subjectData.subjectCode,
    subjectName: subjectData.subjectName,
    assignedTeacher: subjectData.expand?.assignedTeacher,
    subjectCredit: subjectData.subjectCredit,
    assignedClass: subjectData.expand?.assignedClass,
    // classSchool: subjectData.expand?.assignedClass?.expand,
  }));
};

export const deleteSubject = async (id: string) => {
  const subjectData = await pb.collection("subjects").getOne(id);
  await pb.collection("subjects").delete(id);

  // Log the subject deletion
  await createLog({
    action: "SUBJECT_DELETED",
    description: `Subject "${subjectData.subjectName}" (${subjectData.subjectCode}) was deleted`,
    entityType: "subject",
    entityId: id,
    metadata: {
      subjectName: subjectData.subjectName,
      subjectCode: subjectData.subjectCode,
    },
  });

  return true;
};

export const updateSubject = async (id: string, body: any) => {
  const updatedData = await pb
    .collection("subjects")
    .update(id, body, { expand: "assignedTeacher,assignedClass" });

  // Log the subject update
  await createLog({
    action: "SUBJECT_UPDATED",
    description: `Subject "${updatedData.subjectName}" (${updatedData.subjectCode}) was updated`,
    entityType: "subject",
    entityId: id,
    metadata: {
      subjectName: updatedData.subjectName,
      subjectCode: updatedData.subjectCode,
      updatedFields: Object.keys(body),
    },
  });

  return {
    id: updatedData.id,
    subjectCode: updatedData.subjectCode,
    subjectName: updatedData.subjectName,
    assignedTeacher: updatedData.expand?.assignedTeacher,
    subjectCredit: updatedData.subjectCredit,
    assignedClass: updatedData.expand?.assignedClass,
  };
};
