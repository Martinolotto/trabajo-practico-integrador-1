import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

//relaciones
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";

export const ArticleTagModel = sequelize.define(
    "ArticleTag",
    {
         id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
        },

        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ArticleModel,
                key: "id"

            }
        },

        //Foreign Key
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TagModel,
                key: "id"
            }
        },
        
    },
     {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)