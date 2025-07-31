import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
    name: string;
    combination: string;
    school: Schema.Types.ObjectId;
    academicYear: string;
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new Schema<IClass>(
    {
        name: {
            type: String,
            required: [true, "Class name is required"],
            trim: true,
        },
        combination: {
            type: String,
            required: [true, "Class combination is required"],
            trim: true,
        },
        school: {
            type: Schema.Types.ObjectId,
            ref: "School",
            required: [true, "School reference is required"],
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
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual populate for students in this class
classSchema.virtual("students", {
    ref: "Student",
    localField: "_id",
    foreignField: "class",
});

// Compound index for unique class per school and academic year
classSchema.index(
    { name: 1, school: 1, academicYear: 1 },
    { unique: true, name: "unique_class_per_school_year" }
);

const Class = mongoose.model<IClass>("Class", classSchema);

export default Class;
