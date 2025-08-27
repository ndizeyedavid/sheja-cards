import Record from "pocketbase";

export enum StaffRole {
  ADMIN = "ADMIN",
  DOS = "DOS",
  BURSAR = "BURSAR",
  TEACHER = "TEACHER",
  PATRON = "PATRON",
  SECRETARY = "SECRETARY",
}

export interface Staff {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
  idNumber: string;
  status: "active" | "inactive";
  school: string;
  avatar?: string;
}

export interface StaffResponse extends Staff {
  expand?: {
    school: {
      id: string;
      name: string;
      logo: string;
      phone: string;
      email: string;
      address: string;
    };
  };
}

export type NewStaffData = Omit<
  Staff,
  "id" | "collectionId" | "collectionName" | "created" | "updated"
>;

export interface StaffError {
  message: string;
  data?: {
    email?: string[];
    phone?: string[];
    idNumber?: string[];
  };
}
