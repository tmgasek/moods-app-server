import config from "./config";
import path from "path";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import { authRouter, userRouter, moodsRouter } from "./routes";
import { protect } from "./middleware";
import fetch from "node-fetch";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const app = express();

// middleware
// app.use(helmet());
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

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// ejs setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// static files
app.use(express.static(path.join(__dirname, "../public")));

// routes
app.use("/auth", authRouter);
app.use("/user", protect, userRouter);
// app.use("/moods", protect, moodsRouter);
app.use("/api/moods", protect, moodsRouter);

app.get("/moods", protect, async (req, res) => {
  const opts = {
    headers: {
      cookie: req.headers.cookie as string,
    },
  };
  // get all the moods from the api
  const response = await fetch("http://localhost:3001/api/moods", opts);
  const data = await response.json();

  console.log(data);

  res.render("index", {
    title: "Moods",
    moods: data,
    user: req.session.userId,
  });
});

app.use("/", (req, res, next) => {
  const { userId } = req.session;

  res.render("home", { title: "Express", user: userId });
});

app.listen(config.PORT, () => {
  console.log(`Server listening on port ${config.PORT}!`);
});
