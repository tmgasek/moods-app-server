import config from "./config";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import { authRouter, userRouter, moodsRouter } from "./routes";
import { protect } from "./middleware";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const app = express();

app.use(
  session({
    name: config.SESSION_NAME,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.SESSION_LIFETIME,
      sameSite: true,
      secure: config.NODE_ENV === "production" ? true : false,
    },
  })
);

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/api/user", protect, userRouter);
app.use("/api/moods", protect, moodsRouter);

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}!`);
});
