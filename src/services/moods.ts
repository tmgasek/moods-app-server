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

  const sql = `
SELECT m.id AS mood_id, m.value AS mood_value, m.note AS mood_note, m.created_at AS mood_created_at, m.updated_at AS mood_updated_at,
         c.id AS context_id, c.value AS context_value
  FROM moods AS m
  LEFT JOIN mood_context AS mc ON m.id = mc.mood_id
  LEFT JOIN contexts AS c ON mc.context_id = c.id
  WHERE m.user_id = ?
`;

  const results = (await db.query(sql, [userId])) as any;
  console.log(results);

  const moods = Object.values(
    results.reduce((acc: any, row: any) => {
      const {
        mood_id,
        mood_value,
        mood_note,
        mood_created_at,
        mood_updated_at,
        context_id,
        context_value,
      } = row;

      if (!acc[mood_id]) {
        acc[mood_id] = {
          id: mood_id,
          value: mood_value,
          note: mood_note,
          created_at: mood_created_at,
          updated_at: mood_updated_at,
          contexts: [],
        };
      }
      if (context_id) {
        acc[mood_id].contexts.push({
          id: context_id,
          value: context_value,
        });
      }

      return acc;
    }, {})
  );
  console.dir(moods, { depth: null });
  return moods;
};

const getOne = async ({ id, userId }: GetOneArgs) => {
  const sql = `
SELECT m.id AS mood_id, m.value AS mood_value, m.note AS mood_note, m.created_at AS mood_created_at, m.updated_at AS mood_updated_at,
         c.id AS context_id, c.value AS context_value
  FROM moods AS m
  LEFT JOIN mood_context AS mc ON m.id = mc.mood_id
  LEFT JOIN contexts AS c ON mc.context_id = c.id
  WHERE m.id = ? AND m.user_id = ?

`;
  const mood = await db.query(sql, [id, userId]);

  // create mood object with nested array of context objects
  const moodObj = mood.reduce((acc: any, row: any) => {
    const {
      mood_id,
      mood_value,
      mood_note,
      mood_created_at,
      mood_updated_at,
      context_id,
      context_value,
    } = row;

    acc.id = mood_id;
    acc.value = mood_value;
    acc.note = mood_note;
    acc.created_at = mood_created_at;
    acc.updated_at = mood_updated_at;
    acc.contexts = [];

    if (context_id) {
      acc.contexts.push({
        id: context_id,
        value: context_value,
      });
    }

    return acc;
  }, {});

  console.log("moodObj", moodObj);
  // TODO: remove brackets
  return [moodObj];
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
