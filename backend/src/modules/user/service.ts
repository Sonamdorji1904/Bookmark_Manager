import { User } from "./model";
import { ApiError } from "../../utils/responseHandler";

type UpdateUserPayload = {
  name?: string;
  avatar?: string | null;
};

export const getUserProfile = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "avatar", "provider", "providerId", "createdAt", "updatedAt"],
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  payload: UpdateUserPayload,
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  user.set({
    name: payload.name ?? user.name,
    avatar: payload.avatar ?? user.avatar,
  });

  await user.save();

  return user;
};
