import db from "./db";

type Context = {
  id: number;
  user_id: number;
  mood_id: number;
  value: string;
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
  note?: string;
}

interface UpdateArgs {
  id: number;
  userId: number;
  value: string;
}

interface RemoveArgs {
  id: number;
  userId: number;
}

interface getMoodsArgs {
  id: number;
  userId: number;
}

const getAll = async ({ userId }: GetAllArgs) => {
  // TODO pagination
  const contexts = await db.query(
    `
    SELECT * FROM contexts WHERE user_id = ? 
    `,
    [userId]
  );

  return contexts;
};

const getOne = async ({ id, userId }: GetOneArgs) => {
  const context = await db.query(
    `
    SELECT * FROM contexts WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  return context;
};

const getMoods = async ({ id, userId }: getMoodsArgs) => {
  const sql =
    "SELECT contexts.* FROM mood_context INNER JOIN contexts ON mood_context.context_id = contexts.id WHERE mood_context.mood_id = ?";
  const moods = await db.query(sql, [id, userId]);

  return moods;
};

const create = async ({ userId, value }: CreateArgs) => {
  const res: any = await db.query(
    `
    INSERT INTO contexts (value, user_id) VALUES (?, ?)
    `,
    [value, userId]
  );

  if (!res.affectedRows) {
    throw new Error("Could not create context");
  }

  // get the context that was just created
  const context = await getOne({ id: res.insertId, userId });

  return context[0];
};

const update = async ({ id, userId, value }: UpdateArgs) => {
  const res: any = await db.query(
    `
    UPDATE contexts SET value = ? WHERE id = ? AND user_id = ?
    `,
    [value, id, userId]
  );

  if (!res.affectedRows) {
    throw new Error("Could not update context");
  }

  const context = await getOne({ id: res.insertId, userId });

  return context[0];
};

const remove = async ({ id, userId }: RemoveArgs) => {
  const res: any = await db.query(
    `
    DELETE FROM contexts WHERE id = ? AND user_id = ?
    `,
    [id, userId]
  );

  if (!res.affectedRows) {
    throw new Error("Could not remove context");
  }

  return id;
};

const contextsService = {
  getAll,
  getOne,
  getMoods,
  create,
  update,
  remove,
};

export default contextsService;
