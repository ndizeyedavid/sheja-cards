import { Router } from "express";
import {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent,
    updateStudentStatus,
    bulkCreateStudents,
} from "../controllers/student.controller";
import { protect, restrictTo, sameSchool } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import {
    createStudentSchema,
    updateStudentSchema,
    bulkCreateStudentsSchema,
} from "../schemas/validation.schema";

const router = Router();

// All routes are protected
router.use(protect);

// Routes accessible by all staff members of the same school
router.get("/", sameSchool, getStudents);
router.get("/:id", sameSchool, getStudent);

// Routes restricted to headmaster and DOS
router.use(restrictTo("HEADMASTER", "DOS"));

router.post("/", uploadSingle("photo"), validate(createStudentSchema), createStudent);

router.post("/bulk", validate(bulkCreateStudentsSchema), bulkCreateStudents);

router
    .route("/:id")
    .patch(uploadSingle("photo"), validate(updateStudentSchema), updateStudent)
    .delete(deleteStudent);

router.patch("/:id/status", updateStudentStatus);

export default router;
