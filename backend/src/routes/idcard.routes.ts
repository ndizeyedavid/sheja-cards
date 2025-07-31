import { Router } from 'express';
import {
  generateStudentIDCard,
  generateClassIDCards,
  generateSelectedIDCards,
} from '../controllers/idcard.controller';
import { protect, sameSchool } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { generateIDCardsSchema } from '../schemas/validation.schema';

const router = Router();

// Protect all routes and ensure same school access
router.use(protect);
router.use(sameSchool);

// Generate ID card for a single student
router.get('/student/:id', generateStudentIDCard);

// Generate ID cards for all students in a class
router.get('/class/:id', generateClassIDCards);

// Generate ID cards for selected students
router.post(
  '/selected',
  validate(generateIDCardsSchema),
  generateSelectedIDCards
);

export default router;