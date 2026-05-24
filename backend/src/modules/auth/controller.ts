import { Request, Response } from "express";
import { User } from "../user/model";
import { AUTH_COOKIE_NAME, createAccessToken, getAuthCookieOptions } from "./service";
import { sendSuccess } from "../../utils/responseHandler";

export const oauthCallbackHandler = async (req: Request, res: Response) => {
  const oauthUser = req.user as User | undefined;

  if (!oauthUser) {
    return res.status(401).json({
      success: false,
      message: "OAuth authentication failed",
    });
  }

  const token = createAccessToken(oauthUser);
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

  return res.redirect(new URL("/", frontendUrl).toString());
};

export const authMeController = async (req: Request, res: Response) => {
  const authUser = req.user;

  if (!authUser) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await User.findByPk(authUser.id, {
    attributes: ["id", "name", "email", "avatar", "provider", "providerId", "createdAt"],
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return sendSuccess(res, user, "Authenticated user profile");
};

export const logoutController = async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());

  return sendSuccess(res, null, "Logged out successfully");
};
