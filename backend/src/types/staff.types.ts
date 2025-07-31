export interface IStaff {
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  role: "HEADMASTER" | "BURSAR" | "PATRON" | "DISCIPLINE_MASTER" | "DOS";
  password: string;
}
