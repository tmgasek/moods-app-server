import { Router } from "express";
import authController from "../controllers/auth";
import { body, validationResult } from "express-validator";

const router = Router();

router.get("/login", authController.pageLogin);

router.post(
  "/login",
  body("username").isString(),
  body("password").isString(),
  authController.login
);

router.get("/register", authController.pageRegister);

router.post(
  "/register",
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters"),
  authController.register
);

router.get("/logout", authController.logout);

export default router;
