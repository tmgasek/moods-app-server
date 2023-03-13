import db from "./db";
import { comparePasswords, hashPassword } from "../utils/auth";

interface RegisterArgs {
  username: string;
  password: string;
}

interface LoginArgs {
  username: string;
  password: string;
}

const register = async ({ username, password }: RegisterArgs) => {
  const hash = await hashPassword(password);
  // this doesn't return correct types, either cast as any or
  // https://stackoverflow.com/questions/62155984/node-mysql2-cant-access-update-results
  const res: any = await db.query(
    "INSERT INTO `users` (username, password) VALUES (?, ?)",
    [username, hash]
  );

  if (!res.affectedRows) {
    throw new Error("Error registering user");
  }

  const userId = res.insertId;

  return userId;
};

const login = async ({ username, password }: LoginArgs) => {
  const rows: any = await db.query(
    "SELECT * FROM `users` WHERE `username` = ?",
    [username]
  );

  const user = rows[0];
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return user.id;
};

const authService = {
  register,
  login,
};

export default authService;
