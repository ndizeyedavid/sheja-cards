export type StudentStatus = "boarding" | "day";

export interface Student {
  id: string;
  fullName: string;
  class: string;
  gender: "Male" | "Female";
  status: StudentStatus;
  profileImage: string;
  year: string;
  registrationNumber: string;
}

export interface CardTemplate {
  id: string;
  name: string;
  preview: string;
  bgColor: string;
}
