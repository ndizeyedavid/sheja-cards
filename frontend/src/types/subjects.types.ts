export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  assignedTeacher?: string;
  subjectCredit: string;
  assignedClass?: string[];
}
