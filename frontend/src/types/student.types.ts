export interface Students {
  id: string;
  registrationNumber: string;
  name: string;
  class: string;
  academicYear: string;
  gender: string;
  status: string;
  avatar: string;
  dateOfBirth: Date;
}

export interface Istudent {
  id: string;
  registrationNumber: string;
  name: string;
  gender: string;
  dateOfBirth: Date;
  Class: any;
  avatar: any;
  expand: {
    Class: {
      name: string;
      combination: string;
    };
  };
}
