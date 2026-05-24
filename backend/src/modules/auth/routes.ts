import { Router } from "express";
import passport from "passport";
import { authenticateJWT } from "../../middlewares/authMiddleware";
import { authMeController, logoutController, oauthCallbackHandler } from "./controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/failure",
    session: false,
  }),
  oauthCallbackHandler,
);

router.get("/failure", (_req, res) => {
  return res.status(401).json({
    success: false,
    message: "OAuth login failed",
  });
});

router.get("/me", authenticateJWT, authMeController);
router.post("/logout", logoutController);

export default router;
