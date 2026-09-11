import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
//imortamos el modelo user para poder referenciar a article.user_id a User.id
import { UserModel } from "./user.model.js";

export const ArticleModel = sequelize.define(
    "Article", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    excerpt: {
        type: DataTypes.STRING(500),
        allowNull: true,
        },

    status: {
        type: DataTypes.ENUM("published", "archived"),
        allowNull: false,
        defaultValue: "published"
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        //tomamos el id de usermodel como fk.
        references: {
        model: UserModel,
        key: "id",
        },
    },
}, 
{
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
}  
);
