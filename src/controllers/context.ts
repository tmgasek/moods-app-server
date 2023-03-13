import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import contextService from "../services/context";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;

  try {
    const contexts = await contextService.getAll({ userId });

    res.json(contexts);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
};

const getMoods = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;

  try {
    const moods = await contextService.getMoods({ userId, contextId: id });

    res.json(moods);
  } catch (err) {
    next(err);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.session;
  const { value } = req.body;

  try {
    const newContext = await contextService.create({ userId, value });

    res.json(newContext);
  } catch (err) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
  const { value } = req.body;
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { userId } = req.session;
};

const contextController = {
  getAll,
  getOne,
  getMoods,
  create,
  update,
  remove,
};

export default contextController;
