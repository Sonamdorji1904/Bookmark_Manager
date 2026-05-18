import { Op } from "sequelize";
import { ApiError } from "../../utils/responseHandler";
import { Bookmark } from "../bookmark/model";
import { Tag } from "./model";

export const createTag = async (
  userId: string,
  payload: { name: string; color?: string | null },
) => {
  const existingTag = await Tag.findOne({
    where: {
      userId,
      name: {
        [Op.iLike]: payload.name,
      },
    },
  });

  if (existingTag) {
    return existingTag;
  }

  return Tag.create({
    userId,
    name: payload.name.trim(),
    color: payload.color ?? null,
  });
};

export const listTags = async (userId: string) => {
  return Tag.findAll({
    where: { userId },
    order: [["name", "ASC"]],
  });
};

export const getOrCreateTagsForUser = async (userId: string, names: string[]) => {
  const normalizedNames = [...new Set(names.map((name) => name.trim()).filter(Boolean))];

  if (!normalizedNames.length) {
    return [];
  }

  const existingTags = await Tag.findAll({
    where: {
      userId,
      name: {
        [Op.in]: normalizedNames,
      },
    },
  });

  const existingNameSet = new Set(existingTags.map((tag) => tag.name.toLowerCase()));

  const tagsToCreate = normalizedNames.filter(
    (name) => !existingNameSet.has(name.toLowerCase()),
  );

  const createdTags = await Promise.all(
    tagsToCreate.map((name) =>
      Tag.create({
        userId,
        name,
      }),
    ),
  );

  return [...existingTags, ...createdTags];
};

export const assignTagToBookmark = async (
  userId: string,
  tagId: string,
  bookmarkId: string,
) => {
  const [tag, bookmark] = await Promise.all([
    Tag.findOne({ where: { id: tagId, userId } }),
    Bookmark.findOne({ where: { id: bookmarkId, userId } }),
  ]);

  if (!tag) {
    throw new ApiError("Tag not found", 404);
  }

  if (!bookmark) {
    throw new ApiError("Bookmark not found", 404);
  }

  await (bookmark as any).addTagEntity(tag);

  if (!bookmark.tags.includes(tag.name)) {
    bookmark.tags = [...bookmark.tags, tag.name];
    await bookmark.save();
  }

  return bookmark.reload({
    include: [{ model: Tag, as: "tagEntities", through: { attributes: [] } }],
  });
};

export const getBookmarksByTag = async (
  userId: string,
  tagId: string,
  page = 1,
  limit = 10,
) => {
  const tag = await Tag.findOne({ where: { id: tagId, userId } });

  if (!tag) {
    throw new ApiError("Tag not found", 404);
  }

  const offset = (page - 1) * limit;

  const { rows, count } = await Bookmark.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Tag,
        as: "tagEntities",
        where: { id: tagId },
        attributes: ["id", "name", "color"],
        through: { attributes: [] },
        required: true,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    tag,
    bookmarks: rows,
    pagination: {
      page,
      limit,
      totalItems: count,
      totalPages: Math.max(Math.ceil(count / limit), 1),
    },
  };
};
