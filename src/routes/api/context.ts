import { Router } from "express";
import contextController from "../../controllers/context";
import { body, validationResult } from "express-validator";

const router = Router();

router.get("/", contextController.getAll);

router.get("/:id", contextController.getOne);

router.get("/:id/moods", contextController.getMoods);

router.post("/", body("value").isString(), contextController.create);

router.put("/:id", body("value").isString(), contextController.update);

router.delete("/:id", contextController.remove);

export default router;
