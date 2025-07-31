import { z } from "zod";

// School Schemas
export const simpleCreateSchoolSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100),
        address: z.string().min(5).max(200),
        phone: z.string().min(10).max(15),
        email: z.email(),
    }),
});

// create school schema with master
export const createSchoolSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100),
        address: z.string().min(5).max(200),
        phone: z.string().min(10).max(15),
        email: z.email(),
        headmaster: z.object({
            name: z.string().min(5),
            email: z.email(),
            password: z.string().min(8, "Invalid password"),
            phone: z.string().min(10).max(15),
            role: z.enum(["HEADMASTER"]),
            idNumber: z.number().int().min(15),
        }),
    }),
});

export const updateSchoolSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100).optional(),
        address: z.string().min(5).max(200).optional(),
        phone: z.string().min(10).max(15).optional(),
        email: z.email().optional(),
        website: z.string().url().optional(),
    }),
});

// Staff Schemas
export const createStaffSchema = z.object({
    body: z.object({
        name: z.string().min(5),
        email: z.email(),
        password: z.string().min(8, "Invalid password"),
        phone: z.string().min(10).max(15),
        role: z.enum(["TEACHER", "DOS", "ACCOUNTANT", "LIBRARIAN", "SECRETARY"]),
        idNumber: z.number().int().min(15),
    }),
});

export const updateStaffSchema = z.object({
    body: z.object({
        firstName: z.string().min(2).max(50).optional(),
        lastName: z.string().min(2).max(50).optional(),
        email: z.email().optional(),
        phone: z.string().min(10).max(15).optional(),
        role: z
            .enum(["TEACHER", "DOS", "ACCOUNTANT", "LIBRARIAN", "SECRETARY"])
            .optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(8),
    }),
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8),
        confirmPassword: z.string().min(8),
    }),
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.email(),
    }),
});

// Class Schemas
export const createClassSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50),
        combination: z.string().min(2).max(50),
        academicYear: z.string().regex(/^\d{4}-\d{4}$/),
    }),
});

export const updateClassSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50).optional(),
        combination: z.string().min(2).max(50).optional(),
    }),
});

// Student Schemas
export const createStudentSchema = z.object({
    body: z.object({
        name: z.string().min(2).max(50),
        dateOfBirth: z.string().datetime(),
        gender: z.enum(["male", "female"]),
        class: z.string(),
        registrationNumber: z.string().min(5).max(20).optional(),
        academicYear: z.string().regex(/^\d{4}-\d{4}$/),
        status: z.enum(["active", "suspended", "expelled", "graduated"]).optional(),
        photo: z.string().optional(),
    }),
});

export const updateStudentSchema = z.object({
    body: z.object({
        firstName: z.string().min(2).max(50).optional(),
        lastName: z.string().min(2).max(50).optional(),
        dateOfBirth: z.string().datetime().optional(),
        gender: z.enum(["male", "female"]).optional(),
        class: z.string().optional(),
        registrationNumber: z.string().min(5).max(20).optional(),
        status: z.enum(["active", "suspended", "expelled", "graduated"]).optional(),
        photo: z.string().optional(),
    }),
});

export const bulkCreateStudentsSchema = z.object({
    body: z.object({
        students: z.array(
            z.object({
                name: z.string().min(2).max(50),
                dateOfBirth: z.string().datetime(),
                gender: z.enum(["male", "female"]),
                registrationNumber: z.string().min(5).max(20),
            })
        ),
        class: z.string(),
        academicYear: z.string().regex(/^\d{4}-\d{4}$/),
    }),
});

// Template Schemas
export const createTemplateSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100),
        academicYear: z.string().regex(/^\d{4}-\d{4}$/),
        layout: z.object({
            dimensions: z.object({
                width: z.number().min(1),
                height: z.number().min(1),
            }),
            elements: z.array(
                z.object({
                    type: z.enum([
                        "schoolLogo",
                        "schoolName",
                        "studentPhoto",
                        "studentName",
                        "registrationNumber",
                        "class",
                        "academicYear",
                        "qrCode",
                    ]),
                    position: z.object({
                        x: z.number().min(0),
                        y: z.number().min(0),
                    }),
                    size: z.object({
                        width: z.number().min(1),
                        height: z.number().min(1),
                    }),
                    style: z
                        .object({
                            fontSize: z.number().optional(),
                            fontWeight: z.string().optional(),
                            textAlign: z.enum(["left", "center", "right"]).optional(),
                        })
                        .optional(),
                })
            ),
        }),
    }),
});

export const updateTemplateSchema = z.object({
    body: z.object({
        name: z.string().min(3).max(100).optional(),
        layout: z
            .object({
                dimensions: z
                    .object({
                        width: z.number().min(1),
                        height: z.number().min(1),
                    })
                    .optional(),
                elements: z.array(
                    z.object({
                        type: z.enum([
                            "schoolLogo",
                            "schoolName",
                            "studentPhoto",
                            "studentName",
                            "registrationNumber",
                            "class",
                            "academicYear",
                            "qrCode",
                        ]),
                        position: z.object({
                            x: z.number().min(0),
                            y: z.number().min(0),
                        }),
                        size: z.object({
                            width: z.number().min(1),
                            height: z.number().min(1),
                        }),
                        style: z
                            .object({
                                fontSize: z.number().optional(),
                                fontWeight: z.string().optional(),
                                textAlign: z.enum(["left", "center", "right"]).optional(),
                            })
                            .optional(),
                    })
                ),
            })
            .optional(),
    }),
});

// ID Card Generation Schema
export const generateIDCardsSchema = z.object({
    body: z.object({
        studentIds: z.array(z.string()).min(1),
    }),
});
