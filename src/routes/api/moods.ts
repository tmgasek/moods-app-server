import { Router } from "express";
import moodsController from "../../controllers/moods";
import { body, param, validationResult } from "express-validator";

const router = Router();

router.get("/", moodsController.getAll);

router.post(
  "/",
  body("value").isString().isLength({ min: 1, max: 255 }),
  body("note")
    .isString()
    .isLength({ max: 255 })
    .withMessage({
      msg: "note must be less than 255 characters",
    })
    .optional(),
  body("contextIds").isArray().optional(),
  moodsController.create
);

router.put(
  "/:id",
  body("note")
    .isString()
    .isLength({ max: 255 })
    .withMessage({
      msg: "note must be less than 255 characters",
    })
    .optional(),
  moodsController.update
);

router.get("/:id", param("id").isInt(), moodsController.getOne);

router.delete("/:id", param("id").isInt(), moodsController.remove);

export default router;
