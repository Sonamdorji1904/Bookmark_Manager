import { Request, Response } from "express";
import { sendPaginated, sendSuccess } from "../../utils/responseHandler";
import {
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  listBookmarks,
  updateBookmark,
} from "./service";

export const createBookmarkController = async (req: Request, res: Response) => {
  const bookmark = await createBookmark(req.user!.id, req.body);
  return sendSuccess(res, bookmark, "Bookmark created", 201);
};

export const updateBookmarkController = async (req: Request, res: Response) => {
  const bookmark = await updateBookmark(req.params.id, req.user!.id, req.body);
  return sendSuccess(res, bookmark, "Bookmark updated");
};

export const deleteBookmarkController = async (req: Request, res: Response) => {
  await deleteBookmark(req.params.id, req.user!.id);
  return sendSuccess(res, null, "Bookmark deleted");
};

export const getBookmarkController = async (req: Request, res: Response) => {
  const bookmark = await getBookmarkById(req.params.id, req.user!.id);
  return sendSuccess(res, bookmark, "Bookmark fetched");
};

export const listBookmarksController = async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;

  if (req.path === "/favorites") {
    query.isFavorite = "true";
  }

  const result = await listBookmarks(req.user!.id, query);
  return sendPaginated(res, result.bookmarks, result.pagination, "Bookmarks fetched");
};
