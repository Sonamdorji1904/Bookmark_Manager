import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from "sequelize";

export class Bookmark extends Model<
  InferAttributes<Bookmark>,
  InferCreationAttributes<Bookmark>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare url: string;
  declare description: CreationOptional<string | null>;
  declare previewImage: CreationOptional<string | null>;
  declare favicon: CreationOptional<string | null>;
  declare domain: string;
  declare tags: CreationOptional<string[]>;
  declare category: CreationOptional<string | null>;
  declare isFavorite: CreationOptional<boolean>;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export const initBookmarkModel = (sequelize: Sequelize) => {
  Bookmark.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      previewImage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      favicon: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Bookmark",
      tableName: "bookmarks",
      indexes: [
        {
          fields: ["userId", "domain"],
        },
        {
          fields: ["createdAt"],
        },
      ],
    },
  );

  return Bookmark;
};
