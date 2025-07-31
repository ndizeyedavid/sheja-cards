import { Request, Response } from "express";
import School from "../models/school.model";
import Staff, { StaffRole } from "../models/staff.model";
import { hashPassword } from "../helpers/bcrypt.helper";
import { generateToken } from "../helpers/jwt.helper";
import { emailTemplates, sendTemplatedEmail } from "../utils/mailer.utils";

/**
 * Create a new school
 */
export const createSchoolSuper = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, colorPalette } = req.body;

        // Create school
        const school = await School.create({
            name,
            email,
            phone,
            address,
            colorPalette,
        });

        res.status(201).json({
            message: "School created successfully",
            data: {
                school,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating school",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
/**
 * Create a new school and its headmaster
 */
export const createSchool = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, colorPalette, headmaster } = req.body;

        // Create school
        const school = await School.create({
            name,
            email,
            phone,
            address,
            colorPalette,
        });

        // Generate temporary password for headmaster
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hashPassword(tempPassword);

        // Create headmaster account
        const headmasterAccount = await Staff.create({
            name: headmaster.name,
            email: headmaster.email,
            phone: headmaster.phone,
            idNumber: headmaster.idNumber,
            password: hashedPassword,
            role: StaffRole.HEADMASTER,
            school: school._id,
        });

        // Send welcome email to headmaster
        await sendTemplatedEmail(
            headmaster.email,
            emailTemplates.welcomeStaff(headmaster.name, "Headmaster", tempPassword)
        );

        // Generate token for headmaster
        const token = generateToken({
            id: headmasterAccount._id as string,
            role: StaffRole.HEADMASTER,
            school: school._id as string,
        });

        res.status(201).json({
            message: "School and headmaster account created successfully",
            data: {
                school,
                headmaster: {
                    ...headmasterAccount.toObject(),
                    token,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating school",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get all schools (paginated)
 */
export const getSchools = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const schools = await School.find()
            .skip(skip)
            .limit(limit)
            .populate("staff", "name email role")
            .populate("classes", "name combination");

        const total = await School.countDocuments();

        res.status(200).json({
            message: "Schools retrieved successfully",
            data: {
                schools,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving schools",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get a single school by ID
 */
export const getSchool = async (req: Request, res: Response) => {
    try {
        const school = await School.findById(req.params.id)
            .populate("staff", "name email role")
            .populate("classes", "name combination")
            .populate("templates", "name isActive");

        if (!school) {
            return res.status(404).json({
                message: "School not found",
            });
        }

        res.status(200).json({
            message: "School retrieved successfully",
            data: school,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving school",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Update a school
 */
export const updateSchool = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, colorPalette } = req.body;

        const school = await School.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                address,
                colorPalette,
            },
            { new: true }
        );

        if (!school) {
            return res.status(404).json({
                message: "School not found",
            });
        }

        res.status(200).json({
            message: "School updated successfully",
            data: school,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating school",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Delete a school
 */
export const deleteSchool = async (req: Request, res: Response) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);

        if (!school) {
            return res.status(404).json({
                message: "School not found",
            });
        }

        // Delete all associated records (staff, classes, students, templates)
        await Promise.all([
            Staff.deleteMany({ school: school._id }),
            // Add other cleanup operations here
        ]);

        res.status(200).json({
            message: "School and all associated data deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting school",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
