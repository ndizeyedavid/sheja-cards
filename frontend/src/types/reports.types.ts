export interface StudentReport {
  id: string;
  name: string;
  classId: string;
  className: string;
  catTotal: number;
  examTotal: number;
  total: number;
  position: number;
  subjects: SubjectMark[];
}

export interface SubjectMark {
  subjectId: string;
  subjectName: string;
  cat: number;
  exam: number;
  total: number;
}

export interface ClassPerformance {
  className: string;
  totalStudents: number;
  highestPercentage: number;
  lowestPercentage: number;
  averagePercentage: number;
  highestStudent: string;
  lowestStudent: string;
}
