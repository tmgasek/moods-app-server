import { Request, Response, NextFunction } from "express";
import moodsService from "../services/moods";

// TODO: req.session.userId is not defined but it should be as path is protected

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;

  try {
    const moods = await moodsService.getAll({ userId });

    res.json(moods);
  } catch (e) {
    console.error("Error getting all moods: ", e);
    next(e);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  try {
    const mood = await moodsService.getOne({ id, userId });
    res.json(mood);
  } catch (e) {
    console.error("Error getting one mood: ", e);
    next(e);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  // TODO
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  // TODO
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  // TODO
};

const moodsController = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

export default moodsController;
