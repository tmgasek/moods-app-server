import { Router } from "express";
import moodsController from "../controllers/moods";

const router = Router();

router.get("/", moodsController.getAll);

router.get("/:id", moodsController.getOne);

router.post("/", moodsController.create);

router.put("/:id", moodsController.update);

router.delete("/:id", moodsController.remove);

export default router;
