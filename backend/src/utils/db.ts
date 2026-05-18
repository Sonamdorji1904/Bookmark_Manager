import { sequelize } from "../configs/db";
import { initBookmarkModel, Bookmark } from "../modules/bookmark";
import { initTagModel, Tag } from "../modules/tag";
import { initUserModel, User } from "../modules/user";

let initialized = false;

export const initializeDatabase = () => {
  if (initialized) {
    return sequelize;
  }

  initUserModel(sequelize);
  initBookmarkModel(sequelize);
  initTagModel(sequelize);

  User.hasMany(Bookmark, {
    foreignKey: "userId",
    as: "bookmarks",
    onDelete: "CASCADE",
  });

  Bookmark.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  User.hasMany(Tag, {
    foreignKey: "userId",
    as: "tags",
    onDelete: "CASCADE",
  });

  Tag.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  Bookmark.belongsToMany(Tag, {
    through: "bookmark_tags",
    as: "tagEntities",
    foreignKey: "bookmarkId",
    otherKey: "tagId",
  });

  Tag.belongsToMany(Bookmark, {
    through: "bookmark_tags",
    as: "bookmarks",
    foreignKey: "tagId",
    otherKey: "bookmarkId",
  });

  initialized = true;
  return sequelize;
};

export const syncDatabase = async () => {
  initializeDatabase();

  await sequelize.authenticate();

  if (process.env.DB_SYNC === "true") {
    await sequelize.sync({ alter: false });
  }
};
