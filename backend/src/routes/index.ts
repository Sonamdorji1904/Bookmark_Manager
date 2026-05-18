import { Router } from "express";
import { authRoutes } from "../modules/auth";
import { bookmarkRoutes } from "../modules/bookmark";
import { tagRoutes } from "../modules/tag";
import { userRoutes } from "../modules/user";

const router = Router();

router.get("/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Bookmark backend is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/bookmarks", bookmarkRoutes);
router.use("/tags", tagRoutes);

export default router;
