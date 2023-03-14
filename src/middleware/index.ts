import { NextFunction, Request, Response } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    req.session.userId = 33;
    // res.status(401).send({ message: "Not authorised" });
    // res.redirect("/auth/login");
    // return;
    next();
  } else {
    next();
  }
};
