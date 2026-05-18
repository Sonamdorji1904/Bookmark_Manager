import { Router } from "express";
import { z } from "zod";
import { authenticateJWT } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validationMiddleware";
import {
  assignTagController,
  createTagController,
  getBookmarksByTagController,
  listTagsController,
} from "./controller";

const router = Router();

const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().max(20).optional(),
});

const tagParamsSchema = z.object({
  id: z.string().uuid(),
});

const assignTagParamsSchema = z.object({
  id: z.string().uuid(),
  bookmarkId: z.string().uuid(),
});

router.use(authenticateJWT);

router.post("/", validate(createTagSchema), createTagController);
router.get("/", listTagsController);
router.post(
  "/:id/bookmarks/:bookmarkId",
  validate(assignTagParamsSchema, "params"),
  assignTagController,
);
router.get("/:id", validate(tagParamsSchema, "params"), getBookmarksByTagController);

export default router;
