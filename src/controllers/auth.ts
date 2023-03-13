import { Request, Response, NextFunction } from "express";
import config from "../config";
import authService from "../services/auth";
import { validationResult } from "express-validator";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = await authService.register({ username, password });
    req.session.userId = userId;
    res.status(200).json({ userId });
  } catch (e: any) {
    console.error("Error registering user: ", e);
    const customErrors = [];

    switch (e.code) {
      case "ER_DUP_ENTRY":
        customErrors.push({ msg: username + " already exists" });
        break;
      default:
        customErrors.push({ msg: "Error registering user:" + e });
    }

    res.status(400).json({ errors: customErrors });

    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const userId = await authService.login({ username, password });
    req.session.userId = userId;
    res.status(200).json({ userId });
  } catch (e: any) {
    const customErrors = [];

    switch (e.message) {
      case "User not found" || "Invalid password":
        customErrors.push({ msg: "Incorrect user or password" });
        break;
      default:
        customErrors.push({ msg: "Something went wrong! " + e });
    }

    res.status(400).json({ errors: customErrors });

    next(e);
  }
};

const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(400).redirect("/");
    }
    res.clearCookie(config.SESSION_NAME);
    res.status(200).json({ msg: "Logged out" });
  });
};

const authController = {
  register,
  login,
  logout,
};

export default authController;
