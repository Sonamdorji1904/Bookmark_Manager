import { NextFunction, Request, Response } from "express";
import { findOrCreateOAuthUser, verifyAccessToken } from "../modules/auth/service";

const allowDevBypass =
  process.env.ALLOW_DEV_AUTH === "true" || process.env.NODE_ENV !== "production";

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (!allowDevBypass) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const devUser = await findOrCreateOAuthUser({
      provider: "google",
      providerId: "dev-bookmark-manager-user",
      email: process.env.DEV_USER_EMAIL || "dev@bookmarkmanager.local",
      name: process.env.DEV_USER_NAME || "Local Dev User",
      avatar: null,
    });

    req.user = {
      id: devUser.id,
      email: devUser.email,
      name: devUser.name,
      avatar: devUser.avatar,
      provider: devUser.provider,
      providerId: devUser.providerId,
    };

    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
