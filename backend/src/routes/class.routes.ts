import { Router } from "express";
import {
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass,
    getClassStats,
} from "../controllers/class.controller";
import { protect, restrictTo, sameSchool } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createClassSchema, updateClassSchema } from "../schemas/validation.schema";

const router = Router();

// All routes are protected
router.use(protect);

// Routes accessible by all staff members of the same school
router.get("/", sameSchool, getClasses);
router.get("/:id", sameSchool, getClass);
router.get("/:id/stats", sameSchool, getClassStats);

// Routes restricted to headmaster and DOS
router.use(restrictTo("HEADMASTER", "DOS"));

router.post("/", validate(createClassSchema), createClass);
router.patch("/:id", validate(updateClassSchema), updateClass);
router.delete("/:id", deleteClass);

export default router;
