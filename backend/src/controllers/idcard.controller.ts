import { Request, Response } from "express";
import Student from "../models/student.model";
import Template from "../models/template.model";
import { generateIDCard, generateBatchIDCards } from "../utils/pdf.generator";

/**
 * Generate ID card for a single student
 */
export const generateStudentIDCard = async (req: Request, res: Response) => {
    try {
        const studentId = req.params.id;
        const schoolId = req.user?.school;

        // Get student with class details
        const student = await Student.findOne({
            _id: studentId,
            school: schoolId,
        }).populate("class", "name combination");

        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        // Get active template for current academic year
        const template = await Template.findOne({
            school: schoolId,
            academicYear: student.academicYear,
            isActive: true,
        });

        if (!template) {
            return res.status(404).json({
                message: "No active template found for this academic year",
            });
        }

        // Generate ID card
        const pdfBuffer = await generateIDCard(template, student);

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${student.registrationNumber}_id_card.pdf`
        );

        // Send PDF
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            message: "Error generating ID card",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Generate ID cards for all students in a class
 */
export const generateClassIDCards = async (req: Request, res: Response) => {
    try {
        const classId = req.params.id;
        const schoolId = req.user?.school;

        // Get all students in the class
        const students = await Student.find({
            class: classId,
            school: schoolId,
        }).populate("class", "name combination");

        if (students.length === 0) {
            return res.status(404).json({
                message: "No students found in this class",
            });
        }

        // Get active template for current academic year
        const template = await Template.findOne({
            school: schoolId,
            academicYear: students[0].academicYear,
            isActive: true,
        });

        if (!template) {
            return res.status(404).json({
                message: "No active template found for this academic year",
            });
        }

        // Generate batch ID cards
        const pdfBuffer = await generateBatchIDCards(template, students);

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=class_${classId}_id_cards.pdf`
        );

        // Send PDF
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            message: "Error generating ID cards",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};

/**
 * Generate ID cards for selected students
 */
export const generateSelectedIDCards = async (req: Request, res: Response) => {
    try {
        const { studentIds } = req.body;
        const schoolId = req.user?.school;

        // Get selected students
        const students = await Student.find({
            _id: { $in: studentIds },
            school: schoolId,
        }).populate("class", "name combination");

        if (students.length === 0) {
            return res.status(404).json({
                message: "No students found",
            });
        }

        // Verify all students are from the same academic year
        const academicYear = students[0].academicYear;
        const differentYear = students.some(
            (student) => student.academicYear !== academicYear
        );

        if (differentYear) {
            return res.status(400).json({
                message: "All students must be from the same academic year",
            });
        }

        // Get active template for the academic year
        const template = await Template.findOne({
            school: schoolId,
            academicYear,
            isActive: true,
        });

        if (!template) {
            return res.status(404).json({
                message: "No active template found for this academic year",
            });
        }

        // Generate batch ID cards
        const pdfBuffer = await generateBatchIDCards(template, students);

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=selected_students_id_cards.pdf`
        );

        // Send PDF
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({
            message: "Error generating ID cards",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
};
