import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplateLayout {
  width: number;
  height: number;
  elements: {
    type: 'text' | 'image' | 'qr';
    x: number;
    y: number;
    width?: number;
    height?: number;
    value?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    field?: string;
  }[];
}

export interface ITemplate extends Document {
  name: string;
  school: Schema.Types.ObjectId;
  academicYear: number;
  layout: ITemplateLayout;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
    academicYear: {
      type: Number,
      required: [true, 'Academic year is required'],
      min: [2000, 'Invalid academic year'],
      max: [2100, 'Invalid academic year'],
    },
    layout: {
      width: {
        type: Number,
        required: [true, 'Template width is required'],
        min: [0, 'Width must be positive'],
      },
      height: {
        type: Number,
        required: [true, 'Template height is required'],
        min: [0, 'Height must be positive'],
      },
      elements: [
        {
          type: {
            type: String,
            enum: ['text', 'image', 'qr'],
            required: true,
          },
          x: {
            type: Number,
            required: true,
          },
          y: {
            type: Number,
            required: true,
          },
          width: Number,
          height: Number,
          value: String,
          fontSize: Number,
          fontFamily: String,
          color: String,
          field: String,
        },
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one active template per school per year
templateSchema.index(
  { school: 1, academicYear: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

const Template = mongoose.model<ITemplate>('Template', templateSchema);

export default Template;
