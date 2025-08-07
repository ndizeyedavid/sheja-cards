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
