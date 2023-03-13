import Router from "express";

const router = Router();

router.get("/me", (req, res) => {
  const userId = req.session.userId;
  if (userId) {
    res.json({
      message: "You are logged in",
      id: userId,
    });
    return;
  }

  res.json({
    message: "You are not logged in",
  });
});

export default router;
