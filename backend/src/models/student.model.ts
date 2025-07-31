import mongoose, { Schema, Document } from "mongoose";

export enum StudentGender {
    MALE = "male",
    FEMALE = "female",
}

export enum StudentStatus {
    ACTIVE = "ACTIVE",
    GRADUATED = "GRADUATED",
    TRANSFERRED = "TRANSFERRED",
    SUSPENDED = "SUSPENDED",
    EXPELLED = "EXPELLED",
}

export interface IStudent extends Document {
    name: string;
    gender: StudentGender;
    dateOfBirth: Date;
    class: Schema.Types.ObjectId;
    school: Schema.Types.ObjectId;
    registrationNumber: string;
    profileImage?: string;
    status: StudentStatus;
    academicYear: string;
    createdAt: Date;
    updatedAt: Date;
}

const studentSchema = new Schema<IStudent>(
    {
        name: {
            type: String,
            required: [true, "Student name is required"],
            trim: true,
        },
        gender: {
            type: String,
            enum: Object.values(StudentGender),
            required: [true, "Gender is required"],
        },
        dateOfBirth: {
            type: Date,
            required: [true, "Date of birth is required"],
        },
        class: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: [true, "Class reference is required"],
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: [true, "School reference is required"],
        },
        registrationNumber: {
            type: String,
            required: [true, "Registration number is required"],
            unique: true,
            trim: true,
        },
        profileImage: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: Object.values(StudentStatus),
            default: StudentStatus.ACTIVE,
        },
        academicYear: {
            type: String,
            required: [true, "Academic year is required"],
            // min: [2000, 'Invalid academic year'],
            // max: [2100, 'Invalid academic year'],
        },
    },
    {
        timestamps: true,
    }
);

// Generate registration number before saving
// studentSchema.pre("save", async function (next) {
//     if (this.isNew) {
//         const currentYear = new Date().getFullYear().toString().slice(-2);
//         const count = await mongoose.model("Student").countDocuments();
//         const sequence = (count + 1).toString().padStart(4, "0");
//         this.registrationNumber = `STD-${currentYear}-${sequence}`;
//     }
//     next();
// });

// Compound index for unique student in a school per academic year
studentSchema.index(
    { name: 1, school: 1, academicYear: 1 },
    { unique: true, name: "unique_student_per_school_year" }
);

const Student = mongoose.model<IStudent>("Student", studentSchema);

export default Student;
