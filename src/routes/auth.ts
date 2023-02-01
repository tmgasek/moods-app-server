import { Router } from "express";
import authController from "../controllers/auth";

const router = Router();

router.get("/login", authController.pageLogin);

router.post("/login", authController.login);

router.get("/register", authController.pageRegister);

router.post("/register", authController.register);

router.get("/logout", authController.logout);

export default router;
