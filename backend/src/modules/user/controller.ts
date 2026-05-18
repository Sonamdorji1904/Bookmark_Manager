import { Request, Response } from "express";
import { sendSuccess } from "../../utils/responseHandler";
import { getUserProfile, updateUserProfile } from "./service";

export const getMyProfileController = async (req: Request, res: Response) => {
  const user = await getUserProfile(req.user!.id);
  return sendSuccess(res, user, "User profile fetched");
};

export const updateMyProfileController = async (
  req: Request,
  res: Response,
) => {
  const user = await updateUserProfile(req.user!.id, req.body);
  return sendSuccess(res, user, "User profile updated");
};
