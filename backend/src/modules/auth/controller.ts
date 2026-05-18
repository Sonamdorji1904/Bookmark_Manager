import { Request, Response } from "express";
import { User } from "../user/model";
import { createAccessToken } from "./service";
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

  if (frontendUrl && req.query.mode !== "json") {
    const redirectUrl = new URL("/auth/callback", frontendUrl);
    redirectUrl.searchParams.set("token", token);
    return res.redirect(redirectUrl.toString());
  }

  return sendSuccess(
    res,
    {
      token,
      user: {
        id: oauthUser.id,
        name: oauthUser.name,
        email: oauthUser.email,
        avatar: oauthUser.avatar,
        provider: oauthUser.provider,
      },
    },
    "Authenticated successfully",
  );
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
    attributes: ["id", "name", "email", "avatar", "provider", "providerId", "createdAt", "updatedAt"],
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return sendSuccess(res, user, "Authenticated user profile");
};
