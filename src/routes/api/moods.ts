import { Router } from "express";
import moodsController from "../../controllers/moods";
import { body, param, validationResult } from "express-validator";

const router = Router();

router.get("/", moodsController.getAll);

router.post(
  "/",
  body("value").isString(),
  body("context")
    .isString()
    .isLength({ max: 255 })
    .withMessage({
      msg: "Context must be less than 255 characters",
    })
    .optional(),
  moodsController.create
);

router.put(
  "/:id",
  body("context")
    .isString()
    .isLength({ max: 255 })
    .withMessage({
      msg: "Context must be less than 255 characters",
    })
    .optional(),
  moodsController.update
);

router.get("/:id", param("id").isInt(), moodsController.getOne);

router.delete("/:id", param("id").isInt(), moodsController.remove);

export default router;
