import { FindAndCountOptions, Op } from "sequelize";
import { fetchLinkMetadata } from "../../utils/metadataFetcher";
import { ApiError } from "../../utils/responseHandler";
import { Tag } from "../tag/model";
import { getOrCreateTagsForUser } from "../tag/service";
import { Bookmark } from "./model";

type BookmarkPayload = {
  title?: string;
  url: string;
  description?: string | null;
  category?: string | null;
  tags?: string[];
  isFavorite?: boolean;
};

type BookmarkQuery = {
  search?: string;
  category?: string;
  tag?: string;
  isFavorite?: string;
  page?: string;
  limit?: string;
};

const parsePagination = (query: BookmarkQuery) => {
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const loadBookmarkById = async (bookmarkId: string, userId: string) => {
  const bookmark = await Bookmark.findOne({
    where: { id: bookmarkId, userId },
    include: [{ model: Tag, as: "tagEntities", through: { attributes: [] } }],
  });

  if (!bookmark) {
    throw new ApiError("Bookmark not found", 404);
  }

  return bookmark;
};

const syncBookmarkTags = async (
  bookmark: Bookmark,
  userId: string,
  tags: string[] | undefined,
) => {
  if (!tags) {
    return;
  }

  const tagEntities = await getOrCreateTagsForUser(userId, tags);
  bookmark.tags = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];

  await bookmark.save();
  await (bookmark as any).setTagEntities(tagEntities);
};

export const createBookmark = async (userId: string, payload: BookmarkPayload) => {
  const metadata = await fetchLinkMetadata(payload.url);

  const bookmark = await Bookmark.create({
    userId,
    url: payload.url,
    title: payload.title?.trim() || metadata.title || payload.url,
    description: payload.description ?? metadata.description,
    previewImage: metadata.previewImage,
    favicon: metadata.favicon,
    domain: metadata.domain,
    category: payload.category ?? null,
    tags: payload.tags ?? [],
    isFavorite: payload.isFavorite ?? false,
  });

  await syncBookmarkTags(bookmark, userId, payload.tags);

  return loadBookmarkById(bookmark.id, userId);
};

export const updateBookmark = async (
  bookmarkId: string,
  userId: string,
  payload: Partial<BookmarkPayload>,
) => {
  const bookmark = await Bookmark.findOne({ where: { id: bookmarkId, userId } });

  if (!bookmark) {
    throw new ApiError("Bookmark not found", 404);
  }

  let refreshedMetadata: Awaited<ReturnType<typeof fetchLinkMetadata>> | null = null;

  if (payload.url && payload.url !== bookmark.url) {
    refreshedMetadata = await fetchLinkMetadata(payload.url);
  }

  bookmark.set({
    title: payload.title ?? bookmark.title,
    url: payload.url ?? bookmark.url,
    description:
      payload.description ??
      refreshedMetadata?.description ??
      bookmark.description,
    previewImage: refreshedMetadata?.previewImage ?? bookmark.previewImage,
    favicon: refreshedMetadata?.favicon ?? bookmark.favicon,
    domain: refreshedMetadata?.domain ?? bookmark.domain,
    category: payload.category ?? bookmark.category,
    isFavorite: payload.isFavorite ?? bookmark.isFavorite,
    tags: payload.tags ?? bookmark.tags,
  });

  await bookmark.save();
  await syncBookmarkTags(bookmark, userId, payload.tags);

  return loadBookmarkById(bookmark.id, userId);
};

export const deleteBookmark = async (bookmarkId: string, userId: string) => {
  const bookmark = await Bookmark.findOne({ where: { id: bookmarkId, userId } });

  if (!bookmark) {
    throw new ApiError("Bookmark not found", 404);
  }

  await bookmark.destroy();
};

export const getBookmarkById = async (bookmarkId: string, userId: string) => {
  return loadBookmarkById(bookmarkId, userId);
};

export const listBookmarks = async (userId: string, query: BookmarkQuery) => {
  const where: any = { userId };
  const include: FindAndCountOptions["include"] = [
    {
      model: Tag,
      as: "tagEntities",
      through: { attributes: [] },
      required: false,
      attributes: ["id", "name", "color"],
    },
  ];

  const searchTerm = query.search?.trim();

  if (searchTerm) {
    include[0] = {
      ...(include[0] as object),
      required: false,
    };

    where[Op.or] = [
      { title: { [Op.iLike]: `%${searchTerm}%` } },
      { description: { [Op.iLike]: `%${searchTerm}%` } },
      { url: { [Op.iLike]: `%${searchTerm}%` } },
      { domain: { [Op.iLike]: `%${searchTerm}%` } },
      { category: { [Op.iLike]: `%${searchTerm}%` } },
      { tags: { [Op.overlap]: [searchTerm] } },
      { "$tagEntities.name$": { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  if (query.category?.trim()) {
    where.category = query.category.trim();
  }

  if (query.isFavorite === "true" || query.isFavorite === "false") {
    where.isFavorite = query.isFavorite === "true";
  }

  if (query.tag?.trim()) {
    const tagTerm = query.tag.trim();

    include[0] = {
      ...(include[0] as object),
      where: {
        name: {
          [Op.iLike]: `%${tagTerm}%`,
        },
      },
      required: true,
    };
  }

  const { page, limit, offset } = parsePagination(query);

  const { rows, count } = await Bookmark.findAndCountAll({
    where,
    include,
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    distinct: true,
  });

  return {
    bookmarks: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.max(Math.ceil(count / limit), 1),
    },
  };
};
