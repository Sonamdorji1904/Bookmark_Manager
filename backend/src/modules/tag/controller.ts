import { Request, Response } from "express";
import { sendPaginated, sendSuccess } from "../../utils/responseHandler";
import {
  assignTagToBookmark,
  createTag,
  getBookmarksByTag,
  listTags,
} from "./service";

export const createTagController = async (req: Request, res: Response) => {
  const tag = await createTag(req.user!.id, req.body);
  return sendSuccess(res, tag, "Tag created", 201);
};

export const listTagsController = async (req: Request, res: Response) => {
  const tags = await listTags(req.user!.id);
  return sendSuccess(res, tags, "Tags fetched");
};

export const assignTagController = async (req: Request, res: Response) => {
  const bookmark = await assignTagToBookmark(
    req.user!.id,
    req.params.id,
    req.params.bookmarkId,
  );

  return sendSuccess(res, bookmark, "Tag assigned to bookmark");
};

export const getBookmarksByTagController = async (
  req: Request,
  res: Response,
) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  const result = await getBookmarksByTag(req.user!.id, req.params.id, page, limit);

  return sendPaginated(
    res,
    {
      tag: result.tag,
      bookmarks: result.bookmarks,
    },
    result.pagination,
    "Bookmarks by tag fetched",
  );
};
