//validaciones para profile
//user_id
//debe ser un entero positivo
//debe existir el usuario
//un usuario solo puede tener un perfil

//first_name y last_name
//2-50 caracteres
//solo letras

//biography
//máximo 500 caracteres

//avatar_url
//url válida opcional

//birth_date
//fecha válida opcional

import { body } from "express-validator";
import { UserModel } from "../models/user.model.js";
import { ProfileModel } from "../models/profile.model.js";

//crear profile
export const createProfileValidations = [
  //validar el user_id que viene por el body
  body("user_id")
    .notEmpty()
    .withMessage("El user_id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El user_id debe ser un número entero positivo")

    //comprobar que el usuario exista
    .custom(async (user_id) => {
      const user = await UserModel.findByPk(user_id);

      if (!user) {
        throw new Error("El usuario no existe");
      }

      return true;
    })

    //comprobar que el usuario no tenga ya un perfil
    .custom(async (user_id) => {
      const profile = await ProfileModel.findOne({
        where: { user_id },
      });

      if (profile) {
        throw new Error("El usuario ya tiene un perfil");
      }

      return true;
    }),

  //validar first_name
  body("first_name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El nombre solo puede contener letras"),

  //validar last_name
  body("last_name")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .isAlpha("es-ES")
    .withMessage("El apellido solo puede contener letras"),

  //biografia opcional, si viene máximo 500 caracteres
  body("biography")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La biografía debe tener como máximo 500 caracteres"),

  //avatar opcional, si viene tiene que ser una URL válida
  body("avatar_url")
    .optional()
    .isURL()
    .withMessage("El avatar_url debe ser una URL válida"),

  //fecha de nacimiento opcional
  body("birth_date")
    .optional()
    .isISO8601()
    .withMessage("La fecha de nacimiento debe tener un formato válido"),
];
