export type StaffRole =
  | "Headmaster"
  | "DOS"
  | "Bursar"
  | "Teacher"
  | "Secretary"
  | "Librarian";

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
  idNumber: string;
  status: "active" | "inactive";
}

export interface NewStaffData extends Omit<Staff, "id" | "status"> {}
