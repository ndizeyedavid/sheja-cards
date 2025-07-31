import mongoose, { Schema, Document } from 'mongoose';
import { comparePassword } from '../helpers/bcrypt.helper';

export enum StaffRole {
  HEADMASTER = 'HEADMASTER',
  DOS = 'DOS',
  BURSAR = 'BURSAR',
  PATRON = 'PATRON',
  TEACHER = 'TEACHER'
}

export interface IStaff extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  idNumber: string;
  role: StaffRole;
  school: Schema.Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    idNumber: {
      type: String,
      required: [true, 'ID number is required'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(StaffRole),
      required: [true, 'Staff role is required'],
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'School reference is required'],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Compare password method
staffSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await comparePassword(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

const Staff = mongoose.model<IStaff>('Staff', staffSchema);

export default Staff;
