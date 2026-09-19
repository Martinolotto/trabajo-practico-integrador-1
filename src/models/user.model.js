import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

//modelo de nuestra tabla, define para que sequilize la registre
export const UserModel = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },

        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull:false
        },

        role: {
            type: DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user"
        }
    },
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        //habilita eliminacion logica 
        paranoid: true,
        //columna registra cuando se elimino el user
        deletedAt: "deleted_at"
        // destroy() registra la fecha de eliminación en deleted_at.
        // Las consultas normales de Sequelize ignoran esos registros.
    }
);
// Concepto	Qué hace
// paranoid: true	Mantiene el registro y marca deleted_at
// ON DELETE CASCADE	MySQL elimina físicamente los registros dependientes cuando se borra físicamente el registro padre
// ON UPDATE CASCADE	Actualiza claves foráneas dependientes si cambia el valor de la clave referenciada
// sequelize.transaction()	Hace que varias operaciones se confirmen juntas o se reviertan juntas