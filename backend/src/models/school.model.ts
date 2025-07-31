import mongoose, { Schema, Document } from "mongoose";

export interface ISchool extends Document {
    name: string;
    logo?: string;
    email: string;
    phone: string;
    address: string;
    colorPalette: {
        primary: string;
        secondary: string;
        accent: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const schoolSchema = new Schema<ISchool>(
    {
        name: {
            type: String,
            required: [true, "School name is required"],
            trim: true,
        },
        logo: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: [true, "School email is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "School phone number is required"],
            trim: true,
        },
        address: {
            type: String,
            required: [true, "School address is required"],
            trim: true,
        },
        colorPalette: {
            primary: {
                type: String,
                required: [true, "Primary color is required"],
                default: "#000000",
            },
            secondary: {
                type: String,
                required: [true, "Secondary color is required"],
                default: "#ffffff",
            },
            accent: {
                type: String,
                required: [false, "Accent color is required"],
                default: "#808080",
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual populate for staff members
schoolSchema.virtual("staff", {
    ref: "Staff",
    localField: "_id",
    foreignField: "school",
});

// Virtual populate for classes
schoolSchema.virtual("classes", {
    ref: "Class",
    localField: "_id",
    foreignField: "school",
});

// Virtual populate for templates
schoolSchema.virtual("templates", {
    ref: "Template",
    localField: "_id",
    foreignField: "school",
});

const School = mongoose.model<ISchool>("School", schoolSchema);

export default School;
