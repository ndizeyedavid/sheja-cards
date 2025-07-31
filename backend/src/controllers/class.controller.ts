import { Request, Response } from "express";
import Class from "../models/class.model";

/**
 * Create a new class
 */
export const createClass = async (req: Request, res: Response) => {
    try {
        const { name, combination, academicYear } = req.body;
        const schoolId = req.user?.school;

        const classExists = await Class.findOne({
            name,
            school: schoolId,
            academicYear,
        });

        if (classExists) {
            return res.status(400).json({
                message: "Class already exists for this academic year",
            });
        }

        const newClass = await Class.create({
            name,
            combination,
            school: schoolId,
            academicYear,
        });

        res.status(201).json({
            message: "Class created successfully",
            data: newClass,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating class",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get all classes (paginated)
 */
export const getClasses = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const academicYear =
            parseInt(req.query.academicYear as string) || new Date().getFullYear();

        const classes = await Class.find({
            school: req.user?.school,
            academicYear,
        })
            .skip(skip)
            .limit(limit)
            .populate("students", "name registrationNumber");

        const total = await Class.countDocuments({
            school: req.user?.school,
            academicYear,
        });

        res.status(200).json({
            message: "Classes retrieved successfully",
            data: {
                classes,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving classes",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get a single class
 */
export const getClass = async (req: Request, res: Response) => {
    try {
        const classData = await Class.findOne({
            _id: req.params.id,
            school: req.user?.school,
        }).populate("students", "name registrationNumber");

        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        res.status(200).json({
            message: "Class retrieved successfully",
            data: classData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving class",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Update a class
 */
export const updateClass = async (req: Request, res: Response) => {
    try {
        const { name, combination } = req.body;

        const classData = await Class.findOneAndUpdate(
            {
                _id: req.params.id,
                school: req.user?.school,
            },
            { name, combination },
            { new: true }
        );

        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        res.status(200).json({
            message: "Class updated successfully",
            data: classData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating class",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Delete a class
 */
export const deleteClass = async (req: Request, res: Response) => {
    try {
        const classData = await Class.findOne({
            _id: req.params.id,
            school: req.user?.school,
        });

        if (!classData) {
            return res.status(404).json({
                message: "Class not found",
            });
        }

        // Check if class has students
        const studentCount = await classData.populate("students");
        if ((studentCount as any).students?.length > 0) {
            return res.status(400).json({
                message: "Cannot delete class with enrolled students",
            });
        }

        await classData.deleteOne();

        res.status(200).json({
            message: "Class deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting class",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get class statistics
 */
export const getClassStats = async (req: Request, res: Response) => {
    try {
        // const classId = req.params.id;
        // const schoolId = req.user?.school;
        // const classData = await Class.findOne({ _id: classId, school: schoolId })
        //   .populate('students', 'gender status');
        // if (!classData) {
        //   return res.status(404).json({
        //     message: 'Class not found',
        //   });
        // }
        // const stats = {
        //   totalStudents: (classData.students as any).length,
        //   genderDistribution: {
        //     male: (classData.students as any).filter((student: any) => student.gender === 'MALE').length,
        //     female: (classData.students as any).filter((student: any) => student.gender === 'FEMALE').length,
        //   },
        //   statusDistribution: {
        //     active: (classData.students as any).filter((student: any) => student.status === 'ACTIVE').length,
        //     suspended: (classData.students as any).filter((student: any) => student.status === 'SUSPENDED').length,
        //     expelled: (classData.students as any).filter((student: any) => student.status === 'EXPELLED').length,
        //     graduated: (classData.students as any).filter((student: any) => student.status === 'GRADUATED').length,
        //   },
        // };
        // res.status(200).json({
        //   message: 'Class statistics retrieved successfully',
        //   data: stats,
        // });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving class statistics",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
