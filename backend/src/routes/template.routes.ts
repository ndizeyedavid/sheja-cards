import { Router } from "express";
import {
    createTemplate,
    getTemplates,
    getTemplate,
    updateTemplate,
    deleteTemplate,
    setActiveTemplate,
    createDefaultTemplate,
} from "../controllers/template.controller";
import { protect, restrictTo, sameSchool } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTemplateSchema, updateTemplateSchema } from "../schemas/validation.schema";

const router = Router();

// All routes are protected
router.use(protect);

// Routes accessible by all staff members of the same school
router.get("/", sameSchool, getTemplates);
router.get("/:id", sameSchool, getTemplate);

// Routes restricted to headmaster and DOS
router.use(restrictTo("HEADMASTER", "DOS"));

router.post("/", validate(createTemplateSchema), createTemplate);
router.post("/default", createDefaultTemplate);

router
    .route("/:id")
    .patch(validate(updateTemplateSchema), updateTemplate)
    .delete(deleteTemplate);

router.patch("/:id/activate", setActiveTemplate);

export default router;
