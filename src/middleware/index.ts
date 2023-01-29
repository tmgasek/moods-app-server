import { NextFunction, Request, Response } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    res.status(401).send({ message: "Not authorised" });
    return;
  } else {
    next();
  }
};
