import db from "./db";

type Mood = {
  id: number;
  user_id: number;
  value: string;
  context: string;
  created_at?: string;
  updated_at?: string;
};

interface GetAllArgs {
  userId: number;
}

interface GetOneArgs {
  id: number;
  userId: number;
}

interface CreateArgs {
  userId: number;
  mood: Mood;
}

interface UpdateArgs {
  id: number;
  userId: number;
  mood: Mood;
}

interface RemoveArgs {
  id: number;
  userId: number;
}

const getAll = async ({ userId }: GetAllArgs) => {
  // TODO pagination
  const moods = await db.query(
    `
    SELECT * FROM moods WHERE user_id = ?
    `,
    [userId]
  );
  return moods;
};

const getOne = async ({ id, userId }: GetOneArgs) => {
  // TODO
  const mood = await db.query(
    `
    SELECT * FROM moods WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );
  return mood;
};

const create = async ({ userId, mood }: CreateArgs) => {
  // TODO
};

const update = async ({ id, userId, mood }: UpdateArgs) => {
  // TODO
};

const remove = async ({ id, userId }: RemoveArgs) => {
  // TODO
};

const moodsService = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

export default moodsService;
