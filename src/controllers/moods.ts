import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import moodService from "../services/moods";

// TODO: req.session.userId is not defined but it should be as path is protected
// https://stackoverflow.com/questions/66614337/typescript-req-user-is-possibly-undefined-express-and-passport-js

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;

  try {
    const moods: any = await moodService.getAll({ userId });
    // parse the mood date to a readable format
    // moods.forEach((mood: any) => {
    //   mood.created_at = new Date(mood.created_at).toLocaleDateString("en-GB", {
    //     year: "numeric",
    //     month: "long",
    //     day: "numeric",
    //   });
    // });

    res.json(moods);
  } catch (e) {
    console.error("Error getting all moods: ", e);
    res.status(400).json({ message: "Error getting all moods:" + e });
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
    const [mood]: any = await moodService.getOne({ id, userId });

    if (!mood) {
      return res.status(404).json({ message: "Mood not found" });
    }

    // parse the mood date to a readable format
    // mood.created_at = new Date(mood.created_at).toLocaleDateString("en-GB", {
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    // });

    res.json(mood);
  } catch (e) {
    console.error("Error getting one mood: ", e);
    res.status(404).json({ message: "Error getting one mood" + e });
    next(e);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;
  const { value, note, contextIds } = req.body;

  console.log("creating mood", {
    value,
    note,
    contextIds,
    userId,
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const mood = await moodService.create({
      value,
      note,
      userId,
      contextIds,
    });
    res.json(mood).status(201);
  } catch (e: any) {
    console.error("Error creating mood: ", e);
    res.status(400).json({ message: "Error creating a mood" + e });
    next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
  const { note } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const moodId = await moodService.update({ id, note, userId });
    res.json(moodId).status(200);
  } catch (e: any) {
    console.error("Error updating mood: ", e);
    res.status(400).json({ message: "Error updating a mood" + e });
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
    const moodId = await moodService.remove({ id, userId });
    res.json(moodId);
  } catch (e: any) {
    console.error("Error removing mood: ", e);
    res.status(400).json({ message: "Error removing a mood" + e });
    next(e);
  }
};

const moodsController = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

export default moodsController;
