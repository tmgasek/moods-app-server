import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { getProfile } from "../controllers/profile";
import moodsController from "../controllers/moods";

const router = Router();

router.get("/", getProfile);

export default router;
