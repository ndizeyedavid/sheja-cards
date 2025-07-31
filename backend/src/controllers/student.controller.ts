import { Request, Response } from "express";
import Student, { StudentStatus } from "../models/student.model";
import Class from "../models/class.model";

/**
 * Create a new student
 */
export const createStudent = async (req: Request, res: Response) => {
    try {
        const {
            name,
            gender,
            dateOfBirth,
            registrationNumber,
            class: classId,
            academicYear,
        } = req.body;
        const schoolId = req.user?.school;

        // Verify class exists and belongs to school
        const classExists = await Class.findOne({
            _id: classId,
            school: schoolId,
            academicYear,
        });

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found or does not belong to your school",
            });
        }

        const student = await Student.create({
            name,
            gender,
            dateOfBirth,
            class: classId,
            school: schoolId,
            academicYear,
            registrationNumber:
                registrationNumber ||
                `${classExists.combination}-${Math.random().toString().slice(-4)}`,
            status: StudentStatus.ACTIVE,
        });

        res.status(201).json({
            message: "Student created successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get all students (paginated)
 */
export const getStudents = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const academicYear =
            parseInt(req.query.academicYear as string) || new Date().getFullYear();
        const classId = req.query.class as string;
        const status = req.query.status as StudentStatus;

        const query: any = {
            school: req.user?.school,
            academicYear,
        };

        if (classId) query.class = classId;
        if (status) query.status = status;

        const students = await Student.find(query)
            .skip(skip)
            .limit(limit)
            .populate("class", "name combination")
            .sort({ name: 1 });

        const total = await Student.countDocuments(query);

        res.status(200).json({
            message: "Students retrieved successfully",
            data: {
                students,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving students",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Get a single student
 */
export const getStudent = async (req: Request, res: Response) => {
    try {
        const student = await Student.findOne({
            _id: req.params.id,
            school: req.user?.school,
        }).populate("class", "name combination");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message: "Student retrieved successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving student",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Update a student
 */
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { name, gender, dateOfBirth, class: classId, status } = req.body;

        // If class is being updated, verify it exists and belongs to school
        if (classId) {
            const classExists = await Class.findOne({
                _id: classId,
                school: req.user?.school,
            });

            if (!classExists) {
                return res.status(404).json({
                    message: "Class not found or does not belong to your school",
                });
            }
        }

        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                school: req.user?.school,
            },
            { name, gender, dateOfBirth, class: classId, status },
            { new: true }
        ).populate("class", "name combination");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating student",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Delete a student
 */
export const deleteStudent = async (req: Request, res: Response) => {
    try {
        const student = await Student.findOneAndDelete({
            _id: req.params.id,
            school: req.user?.school,
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Update student status
 */
export const updateStudentStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;

        const student = await Student.findOneAndUpdate(
            {
                _id: req.params.id,
                school: req.user?.school,
            },
            { status },
            { new: true }
        ).populate("class", "name combination");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.status(200).json({
            message: "Student status updated successfully",
            data: student,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating student status",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Bulk create students
 */
export const bulkCreateStudents = async (req: Request, res: Response) => {
    try {
        const { students, classId, academicYear } = req.body;
        const schoolId = req.user?.school;

        // Verify class exists and belongs to school
        const classExists = await Class.findOne({
            _id: classId,
            school: schoolId,
            academicYear,
        });

        if (!classExists) {
            return res.status(404).json({
                message: "Class not found or does not belong to your school",
            });
        }

        // Prepare student records
        const studentRecords = students.map((student: any) => ({
            ...student,
            class: classId,
            school: schoolId,
            academicYear,
            status: StudentStatus.ACTIVE,
        }));

        const createdStudents = await Student.insertMany(studentRecords);

        res.status(201).json({
            message: "Students created successfully",
            data: {
                count: createdStudents.length,
                students: createdStudents,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating students",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
