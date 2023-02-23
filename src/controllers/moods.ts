import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import moodsService from "../services/moods";

// TODO: req.session.userId is not defined but it should be as path is protected
// https://stackoverflow.com/questions/66614337/typescript-req-user-is-possibly-undefined-express-and-passport-js

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;

  try {
    const moods: any = await moodsService.getAll({ userId });
    // parse the mood date to a readable format
    moods.forEach((mood: any) => {
      mood.created_at = new Date(mood.created_at).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    res.render("index", { moods, title: "Moods", user: userId });
  } catch (e) {
    console.error("Error getting all moods: ", e);
    next(e);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const [mood]: any = await moodsService.getOne({ id, userId });

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    mood.created_at = new Date(mood.created_at).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    res.render("mood", { mood, title: "Mood", user: userId });
  } catch (e) {
    console.error("Error getting one mood: ", e);
    res.status(404).json({ message: "Mood not found" + e });
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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const moodId = await moodsService.create({ value, context, userId });
    res.status(201).redirect("/moods");
  } catch (e: any) {
    console.error("Error creating mood: ", e);
    const customErrors = [];

    switch (e.message) {
      case "Could not create mood":
        customErrors.push({ msg: "Could not create mood" });
        break;
      default:
        customErrors.push({ msg: "Error creating a mood" + e });
    }

    res.status(400).json({ errors: errors.array() });
    next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
  const { context } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const moodId = await moodsService.update({ id, context, userId });
    res.json(moodId).status(200);
  } catch (e: any) {
    console.error("Error updating mood: ", e);
    const customErrors = [];

    switch (e.message) {
      case "Could not update mood":
        customErrors.push({ msg: "Could not update mood" });
        break;
      default:
        customErrors.push({ msg: "Error updating a mood" + e });
    }

    res.status(400).json({ errors: customErrors });
    next(e);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const moodId = await moodsService.remove({ id, userId });
    res.json(moodId);
  } catch (e: any) {
    console.error("Error removing mood: ", e);
    const customErrors = [];

    switch (e.message) {
      case "Could not remove mood":
        customErrors.push({ msg: "Could not remove mood" });
        break;
      default:
        customErrors.push({ msg: "Error removing a mood" + e });
    }

    res.status(400).json({ errors: customErrors });
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
