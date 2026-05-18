import { Router } from "express";
import { z } from "zod";
import { authenticateJWT } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validationMiddleware";
import {
  createBookmarkController,
  deleteBookmarkController,
  getBookmarkController,
  listBookmarksController,
  updateBookmarkController,
} from "./controller";

const router = Router();

const bookmarkSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  url: z.string().url(),
  description: z.string().max(5000).optional(),
  category: z.string().max(120).nullable().optional(),
  tags: z.array(z.string().min(1).max(50)).optional(),
  isFavorite: z.boolean().optional(),
});

const bookmarkUpdateSchema = bookmarkSchema.partial();

const idSchema = z.object({
  id: z.string().uuid(),
});

router.use(authenticateJWT);

router.post("/", validate(bookmarkSchema), createBookmarkController);
router.get("/", listBookmarksController);
router.get("/search", listBookmarksController);
router.get("/favorites", listBookmarksController);
router.get("/:id", validate(idSchema, "params"), getBookmarkController);
router.patch(
  "/:id",
  validate(idSchema, "params"),
  validate(bookmarkUpdateSchema),
  updateBookmarkController,
);
router.delete("/:id", validate(idSchema, "params"), deleteBookmarkController);

export default router;
