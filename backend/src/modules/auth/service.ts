import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { OAuthUserInput, oauthUserSchema } from "./model";
import { User } from "../user/model";

dotenv.config();

export type JwtPayload = {
  id: string;
  email: string;
  name: string;
  provider: "google" | "github";
  providerId: string;
};

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}

export const findOrCreateOAuthUser = async (input: OAuthUserInput) => {
  const parsed = oauthUserSchema.parse(input);

  const existingUser = await User.findOne({
    where: {
      provider: parsed.provider,
      providerId: parsed.providerId,
    },
  });

  if (existingUser) {
    const shouldUpdate =
      existingUser.email !== parsed.email ||
      existingUser.name !== parsed.name ||
      existingUser.avatar !== parsed.avatar;

    if (shouldUpdate) {
      existingUser.set({
        email: parsed.email,
        name: parsed.name,
        avatar: parsed.avatar ?? null,
      });

      await existingUser.save();
    }

    return existingUser;
  }

  const fallbackUser = await User.findOne({ where: { email: parsed.email } });

  if (fallbackUser) {
    fallbackUser.set({
      name: parsed.name,
      avatar: parsed.avatar ?? fallbackUser.avatar,
      provider: parsed.provider,
      providerId: parsed.providerId,
    });

    await fallbackUser.save();
    return fallbackUser;
  }

  return User.create({
    name: parsed.name,
    email: parsed.email,
    avatar: parsed.avatar ?? null,
    provider: parsed.provider,
    providerId: parsed.providerId,
  });
};

export const createAccessToken = (
  user: Pick<User, "id" | "email" | "name" | "provider" | "providerId">,
) => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    provider: user.provider,
    providerId: user.providerId,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};
