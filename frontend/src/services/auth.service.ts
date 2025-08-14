import { api } from "@/lib/api";
import pb from "@/lib/pb";
import { createLog } from "./logs.service";

interface Ilogin {
  email: string;
  password: string;
}

export const signup = async (data: any) => {
  let schoolData = {
    name: data.schoolName,
    email: data.schoolEmail,
    phone: data.schoolPhone,
    address: data.schoolLocation,
    colorPalette: {
      primary: data.primaryColor,
      secondary: data.secondaryColor,
      accent: data.accentColor,
    },
  };

  const createSchool = await pb.collection("school").create(schoolData);
  if (!createSchool) throw new Error("Failed to create school");

  let headmasterData = {
    name: data.fname + " " + data.lname,
    email: data.email,
    password: data.password,
    passwordConfirm: data.password,
    role: "HEADMASTER",
    phone: data.phone,
    idNumber: Number(data.idNumber),
    school: createSchool.id,
  };
  const createStaff = await pb.collection("staff").create(headmasterData);

  // Log the school creation
  await createLog({
    action: "SCHOOL_CREATED",
    description: `School "${data.schoolName}" was created with headmaster ${data.fname} ${data.lname}`,
    entityType: "school",
    entityId: createSchool.id,
    metadata: { schoolName: data.schoolName, headmasterEmail: data.email },
  });

  return createStaff;
};

export const signin = async (data: Ilogin) => {
  const response = await pb
    .collection("staff")
    .authWithPassword(data.email, data.password, {
      expand: "school",
    });

  // Log the login
  await createLog({
    action: "USER_LOGIN",
    description: `User ${data.email} logged in successfully`,
    entityType: "staff",
    entityId: response.record?.id,
    metadata: { email: data.email },
  });

  return response;
};

// export const signout = async () => {
//   const response = await api.post("/auth/signout");
//   return response.data;
// };

// export const getUser = async () => {
//   const response = await api.get("/auth/user");
//   return response.data;
// };
