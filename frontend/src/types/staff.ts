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
}

export interface NewStaffData extends Omit<Staff, "id" | "status"> {}
