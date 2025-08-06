import * as z from "zod";

export const signupSchema = z
  .object({
    // Personal Information
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),

    // Account Security
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),

    // Identity Verification
    nationalId: z.string().length(16, "National ID must be 16 digits"),

    // School Information
    schoolName: z.string().min(3, "School name must be at least 3 characters"),
    schoolEmail: z.string().email("Please enter a valid school email address"),
    schoolPhone: z.string().min(10, "Please enter a valid phone number"),
    schoolLocation: z.string().min(3, "Please enter a valid location"),

    // School Branding
    schoolLogo: z.any().optional(),
    primaryColor: z.string().min(4, "Please select a primary color"),
    secondaryColor: z.string().min(4, "Please select a secondary color"),
    accentColor: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
