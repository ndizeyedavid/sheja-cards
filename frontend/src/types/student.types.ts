import Record from "pocketbase";

export interface Students {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  registrationNumber: string;
  name: string;
  class: string;
  academicYear: string;
  gender: string;
  status: string;
  email: string;
  avatar: string;
  parent_phone?: string;
  dateOfBirth?: string;
  expand?: {
    class?: {
      id: string;
      name: string;
      combination: string;
      academicYear: string;
    };
    school?: {
      id: string;
      name: string;
      logo: string;
      phone: string;
      email: string;
      address: string;
    };
  };
}

export interface StudentRecord extends Record {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  registrationNumber: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  status: string;
  expand: {
    Class: {
      id: string;
      name: string;
      combination: string;
      academicYear: string;
    };
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

export interface StudentFee extends Record {
  student: string;
  term: number;
  amount: number;
  status: "paid" | "partial" | "pending";
  academicYear: string;
  created: string;
}

export interface SchoolFeeStructure extends Record {
  schoolId: string;
  term: number;
  amount: number;
  dueDate: string;
  academicYear: string;
}
