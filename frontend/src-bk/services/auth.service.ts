import { api } from "@/lib/api";
import axios from "axios";

export const signup = async (data: any) => {
  let formBody = {
    name: data.schoolName,
    email: data.schoolEmail,
    phone: data.schoolPhone,
    address: data.schoolLocation,
    colorPalette: {
      primary: data.primaryColor,
      secondary: data.secondaryColor,
      accent: data.accentColor,
    },
    headmaster: {
      name: data.fname + " " + data.lname,
      email: data.email,
      password: data.password,
      role: "HEADMASTER",
      phone: data.phone,
      idNumber: Number(data.idNumber),
    },
  };

  const response = await api.post("/schools", formBody);
  return response.data;
};

export const signin = async (data: any) => {
  const response = await api.post("/staff/login", data);
  return response.data;
};

export const signout = async () => {
  const response = await api.post("/auth/signout");
  return response.data;
};

export const getUser = async () => {
  const response = await api.get("/auth/user");
  return response.data;
};
