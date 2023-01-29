import { Request, Response, NextFunction } from "express";
import config from "../config";
import authService from "../services/auth";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  //TODO: add validation

  try {
    const userId = await authService.register({ username, password });
    req.session.userId = userId;
    return res.json({ userId, message: "Success" });
  } catch (e: any) {
    console.error("Error registering user: ", e);
    if (e.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username already exists" });
    }
    // Add some error handling
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  //TODO: add validation

  try {
    const userId = await authService.login({ username, password });
    req.session.userId = userId;
    res.json({ message: "Success" });
  } catch (e) {
    console.error("Error logging in user: ", e);
    next(e);
  }
};

const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      // return res.redirect("/home");
    }
    res.clearCookie(config.SESSION_NAME);
    // res.redirect("/login");
  });
};

const authController = {
  register,
  login,
  logout,
};

export default authController;
