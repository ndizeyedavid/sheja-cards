import pb from "@/lib/pb";
import { RecordModel } from "pocketbase";

export interface TeacherInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  combination?: string;
}

export interface SubjectInfo {
  id: string;
  subjectName: string;
  assignedClass: string;
}

export interface StudentInfo {
  id: string;
  profileImage: any;
  name: string;
  registrationNumber: string;
  gender: string;
  status: string;
  Class: string;
  fullStack: any;
}

/**
 * Fetch current teacher information from auth store
 */
export const getTeacherInfo = (): TeacherInfo | null => {
  if (!pb.authStore.isValid || !pb.authStore.record) {
    return null;
  }

  return {
    id: pb.authStore.record.id,
    name: pb.authStore.record.name,
    email: pb.authStore.record.email,
    role: pb.authStore.record.role,
    avatar: pb.authStore.record.avatar,
    phone: pb.authStore.record.phone,
  };
};

/**
 * Fetch all classes and subjects assigned to the teacher
 */
export const fetchTeacherClassesAndSubjects = async (): Promise<{
  classes: ClassInfo[];
  subjects: SubjectInfo[];
}> => {
  const teacherId = pb.authStore.record?.id;
  if (!teacherId) {
    throw new Error("Teacher not authenticated");
  }

  const schoolId = pb.authStore.record?.school;
  // const academicYear = localStorage.getItem("academicYear");

  const subjectRecords = await pb.collection("subjects").getFullList({
    filter: `assignedTeacher = "${teacherId}" && school = "${schoolId}"`,
    expand: "assignedClass",
  });

  const uniqueClasses: { [key: string]: ClassInfo } = {};
  const subjectsList: SubjectInfo[] = [];

  subjectRecords.forEach((subject: any) => {
    // assignedClass is an array of IDs, expand.assignedClass is an array of class objects
    if (
      subject.expand?.assignedClass &&
      Array.isArray(subject.expand.assignedClass)
    ) {
      subject.expand.assignedClass.forEach((classData: any) => {
        if (!uniqueClasses[classData.id]) {
          uniqueClasses[classData.id] = {
            id: classData.id,
            name: classData.name,
            combination: classData.combination,
          };
        }
      });
    }

    // For each class assigned to this subject, create a subject entry
    if (Array.isArray(subject.assignedClass)) {
      subject.assignedClass.forEach((classId: string) => {
        subjectsList.push({
          id: subject.id,
          subjectName: subject.subjectName,
          assignedClass: classId,
        });
      });
    }
  });

  return {
    classes: Object.values(uniqueClasses),
    subjects: subjectsList,
  };
};

/**
 * Fetch all students in a specific class
 */
export const fetchStudentsByClass = async (
  classId: string
): Promise<StudentInfo[]> => {
  const schoolId = pb.authStore.record?.school;
  const studentRecords = await pb.collection("students").getFullList({
    filter: `Class = "${classId}" && school = "${schoolId}"`,
    expand: "Class",
  });

  return studentRecords.map((student: any) => ({
    id: student.id,
    profileImage: student.profileImage,
    name: student.name,
    registrationNumber: student.registrationNumber,
    gender: student.gender,
    status: student.status,
    Class: student.Class,
    fullStack: studentRecords,
  }));
};

/**
 * Logout the teacher
 */
export const logoutTeacher = (): void => {
  pb.authStore.clear();
};
