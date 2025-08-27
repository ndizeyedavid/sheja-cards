import pb from "@/lib/pb";
import { createLog } from "./logs.service";
import { Staff } from "@/types/staff";
import { RecordModel } from "pocketbase";

export const fetchStaff = async (): Promise<Staff[]> => {
  const schoolId = pb.authStore.record?.school;
  const res = await pb.collection("staff").getFullList({
    filter: `school = "${schoolId}" && isDeleted = false && role!="HEADMASTER"`,
  });
  return res.map((record: RecordModel) => ({
    id: record.id,
    collectionId: record.collectionId,
    collectionName: record.collectionName,
    created: record.created,
    updated: record.updated,
    name: record.name,
    email: record.email,
    role: record.role,
    phone: record.phone,
    idNumber: record.idNumber,
    status: record.status || 'active',
    school: record.school,
    avatar: record.avatar
  }));
};

export const createStaff = async (data: any): Promise<Staff> => {
  const schoolId = pb.authStore.record?.school;
  const tempPassword = Math.random().toString(36).slice(-8);
  const res = await pb.collection("staff").create({
    ...data,
    password: tempPassword,
    passwordConfirm: tempPassword,
    emailVisibility: true,
    ps: tempPassword,
    school: schoolId,
  });

  // Log the staff creation
  await createLog({
    action: "STAFF_CREATED",
    description: `Staff member "${data.name}" was created with role ${data.role}`,
    entityType: "staff",
    entityId: res.id,
    metadata: { staffName: data.name, role: data.role, email: data.email },
  });

  return {
    id: res.id,
    collectionId: res.collectionId,
    collectionName: res.collectionName,
    created: res.created,
    updated: res.updated,
    name: res.name,
    email: res.email,
    role: res.role,
    phone: res.phone,
    idNumber: res.idNumber,
    status: res.status || 'active',
    school: res.school,
    avatar: res.avatar
  };
};

export const updateStaff = async (id: string, data: any) => {
  const schoolId = pb.authStore.record?.school;
  console.log(id);
  const res = await pb.collection("staff").update(id, {
    ...data,
    school: schoolId,
  });

  // Log the staff update
  await createLog({
    action: "STAFF_UPDATED",
    description: `Staff member "${data.name}" was updated`,
    entityType: "staff",
    entityId: id,
    metadata: { staffName: data.name, updatedFields: Object.keys(data) },
  });

  return res.map((record: RecordModel) => ({
    id: record.id,
    collectionId: record.collectionId,
    collectionName: record.collectionName,
    created: record.created,
    updated: record.updated,
    name: record.name,
    email: record.email,
    role: record.role,
    phone: record.phone,
    idNumber: record.idNumber,
    status: record.status || 'active',
    school: record.school,
    avatar: record.avatar
  }));
};

export const deleteStaff = async (id: string) => {
  const staff = await pb.collection("staff").getOne(id);
  await pb.collection("staff").update(id, {
    isDeleted: true,
  });

  // Log the staff deletion
  await createLog({
    action: "STAFF_DELETED",
    description: `Staff member "${staff.name}" was deleted`,
    entityType: "staff",
    entityId: id,
    metadata: { staffName: staff.name, role: staff.role },
  });
};

export const fetchStaffById = async (id: string) => {
  const res = await pb.collection("staff").getOne(id);
  return res;
};

// Profile management functions
export const getCurrentUser = async () => {
  if (!pb.authStore.isValid) {
    throw new Error("User not authenticated");
  }
  return pb.authStore.model;
};

export const updateProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
}) => {
  if (!pb.authStore.isValid) {
    throw new Error("User not authenticated");
  }

  const userId = pb.authStore.model?.id;
  if (!userId) {
    throw new Error("User ID not found");
  }

  const res = await pb.collection("staff").update(userId, data);

  // Log the profile update
  await createLog({
    action: "PROFILE_UPDATED",
    description: `Profile was updated`,
    entityType: "staff",
    entityId: userId,
    metadata: { updatedFields: Object.keys(data) },
  });

  return res;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  if (!pb.authStore.isValid) {
    throw new Error("User not authenticated");
  }

  const userId = pb.authStore.record?.id;
  if (!userId) {
    throw new Error("User ID not found");
  }

  // First verify current password
  try {
    await pb
      .collection("staff")
      .authWithPassword(pb.authStore.record?.email || "", data.currentPassword);
  } catch (error) {
    throw new Error("Current password is incorrect");
  }

  // Update password
  const res = await pb.collection("staff").update(userId, {
    oldPassword: data.currentPassword,
    password: data.newPassword,
    passwordConfirm: data.newPassword,
  });

  // Log the password change
  await createLog({
    action: "PASSWORD_CHANGED",
    description: `Password was changed`,
    entityType: "staff",
    entityId: userId,
    metadata: { email: pb.authStore.record?.email },
  });

  return res;
};

export const updateAvatar = async (file: File) => {
  if (!pb.authStore.isValid) {
    throw new Error("User not authenticated");
  }

  const userId = pb.authStore.model?.id;
  if (!userId) {
    throw new Error("User ID not found");
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await pb.collection("staff").update(userId, formData);

  // Log the avatar update
  await createLog({
    action: "AVATAR_UPDATED",
    description: `Avatar was updated`,
    entityType: "staff",
    entityId: userId,
    metadata: { fileName: file.name, fileSize: file.size },
  });

  return res;
};

export const logout = async () => {
  const userId = pb.authStore.record?.id;
  const email = pb.authStore.record?.email;

  pb.authStore.clear();

  // Log the logout (this will be the last action before clearing auth)
  if (userId) {
    try {
      await createLog({
        action: "USER_LOGOUT",
        description: `User ${email} logged out`,
        entityType: "staff",
        entityId: userId,
        metadata: { email },
      });
    } catch (error) {
      // Ignore logging errors on logout
      console.log("Could not log logout action");
    }
  }
};
