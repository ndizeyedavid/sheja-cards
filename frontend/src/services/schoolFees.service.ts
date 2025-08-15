import pb from "@/lib/pb";

export type SchoolFee = {
  id?: string;
  studentId: string;
  term: number;
  academicYear: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  receiptNumber: string;
  status: "paid" | "pending" | "partial";
  notes?: string;
  created?: string;
  updated?: string;
};

export type SchoolFeeStructure = {
  id?: string;
  schoolId: string;
  academicYear: string;
  term: number;
  amount: number;
  dueDate: string;
  created?: string;
  updated?: string;
};

class SchoolFeesService {
  private readonly collection = "school_fees";
  private readonly structureCollection = "fee_structures";

  async getStudentFees(
    studentId: string,
    academicYear?: string
  ): Promise<SchoolFee[]> {
    try {
      const filter = academicYear
        ? `studentId="${studentId}" && academicYear="${academicYear}"`
        : `studentId="${studentId}"`;

      const result = await pb.collection(this.collection).getList(1, 50, {
        filter,
        sort: "+term",
      });

      return result.items as unknown as SchoolFee[];
    } catch (error) {
      console.error("Error fetching student fees:", error);
      throw error;
    }
  }

  async getFeeStructure(
    schoolId: string,
    academicYear: string
  ): Promise<SchoolFeeStructure[]> {
    try {
      const result = await pb
        .collection(this.structureCollection)
        .getList(1, 3, {
          filter: `schoolId="${schoolId}" && academicYear="${academicYear}"`,
          sort: "+term",
        });

      return result.items as unknown as SchoolFeeStructure[];
    } catch (error) {
      console.error("Error fetching fee structure:", error);
      throw error;
    }
  }

  async createFeePayment(feeData: SchoolFee): Promise<SchoolFee> {
    try {
      const result = await pb.collection(this.collection).create(feeData);
      return result as unknown as SchoolFee;
    } catch (error) {
      console.error("Error creating fee payment:", error);
      throw error;
    }
  }

  async updateFeePayment(
    id: string,
    feeData: Partial<SchoolFee>
  ): Promise<SchoolFee> {
    try {
      const result = await pb.collection(this.collection).update(id, feeData);
      return result as unknown as SchoolFee;
    } catch (error) {
      console.error("Error updating fee payment:", error);
      throw error;
    }
  }

  async deleteFeePayment(id: string): Promise<boolean> {
    try {
      await pb.collection(this.collection).delete(id);
      return true;
    } catch (error) {
      console.error("Error deleting fee payment:", error);
      throw error;
    }
  }

  async createFeeStructure(
    structureData: SchoolFeeStructure
  ): Promise<SchoolFeeStructure> {
    try {
      const result = await pb
        .collection(this.structureCollection)
        .create(structureData);
      return result as unknown as SchoolFeeStructure;
    } catch (error) {
      console.error("Error creating fee structure:", error);
      throw error;
    }
  }

  async updateFeeStructure(
    id: string,
    structureData: Partial<SchoolFeeStructure>
  ): Promise<SchoolFeeStructure> {
    try {
      const result = await pb
        .collection(this.structureCollection)
        .update(id, structureData);
      return result as unknown as SchoolFeeStructure;
    } catch (error) {
      console.error("Error updating fee structure:", error);
      throw error;
    }
  }

  async getStudentFeeStatus(
    studentId: string,
    academicYear: string
  ): Promise<{ term: number; status: string; amount: number }[]> {
    try {
      // Get the student's school ID
      const student = await pb.collection("students").getOne(studentId, {
        expand: "school",
      });

      const schoolId = student.expand?.school?.id;

      if (!schoolId) {
        throw new Error("Student's school information not found");
      }

      // Get the fee structure for the school and academic year
      const feeStructure = await this.getFeeStructure(schoolId, academicYear);

      // Get the student's fee payments
      const feePayments = await this.getStudentFees(studentId, academicYear);

      // Calculate status for each term
      return feeStructure.map((structure) => {
        const payment = feePayments.find((p) => p.term === structure.term);

        if (!payment) {
          return {
            term: structure.term,
            status: "pending",
            amount: 0,
          };
        }

        return {
          term: structure.term,
          status: payment.status,
          amount: payment.amount,
        };
      });
    } catch (error) {
      console.error("Error getting student fee status:", error);
      throw error;
    }
  }
}

export const schoolFeesService = new SchoolFeesService();
