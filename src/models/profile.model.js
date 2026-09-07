import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
//imortamos el modelo user para poder referenciar a profile.user_id a User.id
import { UserModel } from "./user.model.js";

export const ProfileModel = sequelize.define(
    "Profile",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
//Foreign Key
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,//para evitar que un mismo uuario tenga dos perfiles
            //profile marca la dependencia de la fk hacia users
            //tomamos el id de usermodel como fk.
            references: {
                model: UserModel,
                key: "id"
            }
        },

        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        biography: {
            type: DataTypes.TEXT,
            allowNull:true
        },

        avatar_url: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        
        birth_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
    
);