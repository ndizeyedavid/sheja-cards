import { Router } from "express";
import {
    createSchool,
    getSchools,
    getSchool,
    updateSchool,
    deleteSchool,
    createSchoolSuper,
} from "../controllers/school.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createSchoolSchema,
    simpleCreateSchoolSchema,
    updateSchoolSchema,
} from "../schemas/validation.schema";

const router = Router();

// Public routes
router.get("/", getSchools);
router.get("/:id", getSchool);

// headmaster create school
router.post("/", validate(createSchoolSchema), createSchool);

// Protected routes
router.use(protect);

// super create school
router.post(
    "/super",
    restrictTo("admin"),
    validate(simpleCreateSchoolSchema),
    createSchoolSuper
);

router.patch("/:id", restrictTo("admin"), validate(updateSchoolSchema), updateSchool);
router.delete("/:id", restrictTo("admin"), deleteSchool);

export default router;
