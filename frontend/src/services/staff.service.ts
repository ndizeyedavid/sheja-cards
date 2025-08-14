import pb from "@/lib/pb";

export const fetchStaff = async () => {
  const schoolId = pb.authStore.record?.school;
  const res = await pb.collection("staff").getFullList({
    filter: `school = "${schoolId}" && isDeleted = false && role!="HEADMASTER"`,
  });
  return res;
};

export const createStaff = async (data: any) => {
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
  return res;
};

export const updateStaff = async (id: string, data: any) => {
  const schoolId = pb.authStore.record?.school;
  console.log(id);
  const res = await pb.collection("staff").update(id, {
    ...data,
    school: schoolId,
  });
  return res;
};

export const deleteStaff = async (id: string) => {
  await pb.collection("staff").update(id, {
    isDeleted: true,
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
  return res;
};

export const logout = async () => {
  pb.authStore.clear();
};
