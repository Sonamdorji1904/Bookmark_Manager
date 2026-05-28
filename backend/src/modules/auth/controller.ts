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
  const frontendUrl = process.env.FRONTEND_URL;

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

  if (user) {
    return sendSuccess(res, user, "Authenticated user profile");
  }

  const fallbackUser = await User.findOne({
    where: { email: authUser.email },
    attributes: ["id", "name", "email", "avatar", "provider", "providerId", "createdAt"],
  });

  if (fallbackUser) {
    return sendSuccess(res, fallbackUser, "Authenticated user profile");
  }

  return sendSuccess(
    res,
    {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      avatar: authUser.avatar ?? null,
      provider: authUser.provider,
      providerId: authUser.providerId,
      createdAt: new Date().toISOString(),
    },
    "Authenticated user profile",
  );
};

export const logoutController = async (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, getAuthCookieOptions());

  return sendSuccess(res, null, "Logged out successfully");
};
