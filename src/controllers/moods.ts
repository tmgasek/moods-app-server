import { Request, Response, NextFunction } from "express";
import moodsService from "../services/moods";

// TODO: req.session.userId is not defined but it should be as path is protected
// https://stackoverflow.com/questions/66614337/typescript-req-user-is-possibly-undefined-express-and-passport-js

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  console.log("getting all moods");
  const { userId } = req.session;
  try {
    const moods = await moodsService.getAll({ userId });
    res.render("index", { moods, title: "Moods", user: userId });

    // res.json(moods);
  } catch (e) {
    console.error("Error getting all moods: ", e);
    next(e);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  console.log("Do i run??");

  try {
    const mood = await moodsService.getOne({ id, userId });
    if (!mood.length) {
      return res.status(404).json({ message: "Mood not found" });
    }
    res.render("mood", { mood: mood[0], title: "Mood", user: userId });
  } catch (e) {
    console.error("Error getting one mood: ", e);
    next(e);
  }
};

const createPage = async (req: Request, res: Response) => {
  const { userId } = req.session;
  res.render("create", { title: "Create mood", user: userId });
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;
  const { value, context } = req.body;

  try {
    const mood = await moodsService.create({ value, context, userId });
    res.redirect("/moods");
  } catch (e) {
    console.error("Error creating mood: ", e);
    next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
  const { context } = req.body;

  console.log("UPDATING XDDDD");

  try {
    const moodId = await moodsService.update({ id, context, userId });
    res.json(moodId);
  } catch (e) {
    console.error("Error updating mood: ", e);
    next(e);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  console.log("REMOVINGG XDDDD");

  try {
    const moodId = await moodsService.remove({ id, userId });
    res.json(moodId);
  } catch (e) {
    console.error("Error removing mood: ", e);
    next(e);
  }
};

const moodsController = {
  getAll,
  getOne,
  create,
  createPage,
  update,
  remove,
};

export default moodsController;
