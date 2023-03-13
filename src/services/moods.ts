import db from "./db";
import dbConfig from "../config/db";
import mysql from "mysql2/promise";

type Mood = {
  id: number;
  user_id: number;
  value: string;
  note: string;
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
  note?: string | null;
  contextIds?: number[];
}

interface UpdateArgs {
  id: number;
  userId: number;
  note: string;
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

const create = async ({ userId, value, note, contextIds }: CreateArgs) => {
  console.log("create mood", { userId, value, note, contextIds });
  if (note === undefined) {
    note = null;
  }

  const sqlMoodInsert =
    "INSERT INTO moods (value, note, user_id) VALUES (?, ?, ?)";

  if (!contextIds) {
    const res: any = await db.query(sqlMoodInsert, [value, note, userId]);
    if (!res.affectedRows) {
      throw new Error("Could not create mood");
    }
    // get the mood that was just created
    const mood = await getOne({ id: res.insertId, userId });

    return mood[0];
  }

  // there is a contextIds array, we need to create transaction
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.beginTransaction();

    // insert mood
    const [result] = await connection.query(sqlMoodInsert, [
      value,
      note,
      userId,
    ]);
    console.log("result", result);
    const moodId = result.insertId;

    // insert mood_context rows
    const res = await Promise.all(
      contextIds.map((contextId) => {
        const sql =
          "INSERT INTO mood_context (mood_id, context_id) VALUES (?, ?)";
        return connection.query(sql, [moodId, contextId]);
      })
    );

    console.log("res", res);
    await connection.commit();
    return { moodId, contextIds };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.end();
  }
};

const update = async ({ id, userId, note }: UpdateArgs) => {
  const res: any = await db.query(
    `
    UPDATE moods SET note = ? WHERE id = ? AND user_id = ?
    `,
    [note, id, userId]
  );

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

  if (!res.affectedRows) {
    throw new Error("Could not remove mood");
  }

  return id;
};

const contextService = {
  getAll,
  getOne,
  create,
  update,
  remove,
};

export default contextService;
