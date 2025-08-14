import pb from "@/lib/pb";
import { createLog } from "./logs.service";

export const fetchSchool = async () => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  const res = await pb.collection("school").getOne(schoolId);
  return res;
};

export const updateSchool = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  colorPalette?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  logo?: File;
}) => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  const res = await pb.collection("school").update(schoolId, data);

  // Log the school update
  await createLog({
    action: "SCHOOL_UPDATED",
    description: `School information was updated`,
    entityType: "school",
    entityId: schoolId,
    metadata: { updatedFields: Object.keys(data) },
  });

  return res;
};

export const updateSchoolLogo = async (file: File) => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  const formData = new FormData();
  formData.append("logo", file);

  const res = await pb.collection("school").update(schoolId, formData);

  // Log the logo update
  await createLog({
    action: "SCHOOL_LOGO_UPDATED",
    description: `School logo was updated`,
    entityType: "school",
    entityId: schoolId,
    metadata: { fileName: file.name, fileSize: file.size },
  });

  return res;
};

export const updateSchoolColors = async (colors: {
  primary?: string;
  secondary?: string;
  accent?: string;
}) => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  const res = await pb.collection("school").update(schoolId, {
    colorPalette: colors,
  });

  // Log the colors update
  await createLog({
    action: "SCHOOL_COLORS_UPDATED",
    description: `School colors were updated`,
    entityType: "school",
    entityId: schoolId,
    metadata: { colors },
  });

  return res;
};

export const getSchoolStats = async () => {
  const schoolId = pb.authStore.record?.school;
  if (!schoolId) {
    throw new Error("School ID not found");
  }

  // Get counts for different entities
  const [students, staff, classes] = await Promise.all([
    pb.collection("student").getFullList({
      filter: `school = "${schoolId}" && isDeleted = false`,
    }),
    pb.collection("staff").getFullList({
      filter: `school = "${schoolId}" && isDeleted = false`,
    }),
    pb.collection("class").getFullList({
      filter: `school = "${schoolId}" && isDeleted = false`,
    }),
  ]);

  return {
    totalStudents: students.length,
    totalStaff: staff.length,
    totalClasses: classes.length,
  };
};
