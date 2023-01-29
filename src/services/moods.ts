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
  value: string;
  context?: string;
}

interface UpdateArgs {
  id: number;
  userId: number;
  context: string;
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
  const mood = await db.query(
    `
    SELECT * FROM moods WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  return mood;
};

const create = async ({ userId, value, context }: CreateArgs) => {
  const res: any = await db.query(
    `
    INSERT INTO moods (value, context, user_id) VALUES (?, ?, ?)
    `,
    [value, context, userId]
  );

  if (!res.affectedRows) {
    throw new Error("Could not create mood");
  }

  return res.insertId;
};

const update = async ({ id, userId, context }: UpdateArgs) => {
  const res: any = await db.query(
    `
    UPDATE moods SET context = ? WHERE id = ? AND user_id = ?
    `,
    [context, id, userId]
  );

  console.log("UPDATE RES", res);

  if (!res.affectedRows) {
    throw new Error("Could not update mood");
  }

  return id;
};

const remove = async ({ id, userId }: RemoveArgs) => {
  const res: any = await db.query(
    `
    DELETE FROM moods WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  console.log("DELETE RES", res);

  if (!res.affectedRows) {
    throw new Error("Could not remove mood");
  }

  return id;
};

const moodsService = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

export default moodsService;
