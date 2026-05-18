import { Router } from "express";
import { z } from "zod";
import { authenticateJWT } from "../../middlewares/authMiddleware";
import { validate } from "../../middlewares/validationMiddleware";
import { getMyProfileController, updateMyProfileController } from "./controller";

const router = Router();

const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatar: z.string().url().nullable().optional(),
});

router.get("/me", authenticateJWT, getMyProfileController);
router.patch(
  "/me",
  authenticateJWT,
  validate(updateProfileSchema),
  updateMyProfileController,
);

export default router;
