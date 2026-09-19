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
            },
            //si se borra físicamente el artículo,
            //también se borran sus relaciones con etiquetas
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        //Foreign Key
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: TagModel,
                key: "id"
            },
             //si se borra físicamente la etiqueta,
            //también se borran sus relaciones con artículos
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },
        
    },
     {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
)