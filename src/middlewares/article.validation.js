//validaciones para article
//title
//3-200 caracteres
//obligatorio

//content
//mínimo 50 caracteres
//obligatorio

//excerpt
//máximo 500 caracteres
//opcional

//status
//published o archived

//user_id
//entero positivo
//debe existir el usuario

import { body, param } from "express-validator";
import { ArticleModel } from "../models/article.model.js";
import { UserModel } from "../models/user.model.js";

//crear article
export const createArticleValidations = [
  //validar title que viene por el body
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),

  //validar content que viene por el body
  body("content")
    .notEmpty()
    .withMessage("El contenido es obligatorio")
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener al menos 50 caracteres"),

  //excerpt es opcional, si viene máximo 500 caracteres
  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El excerpt debe tener como máximo 500 caracteres"),

  //status es opcional porque el modelo ya tiene published por defecto
  //si viene solo puede ser published o archived
  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El status debe ser published o archived"),

  //validar user_id que viene por el body
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
    }),
];

//obtener article por id
export const getArticleByIdValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el artículo exista en la base de datos
    .custom(async (id) => {
      const article = await ArticleModel.findByPk(id);

      if (!article) {
        throw new Error("El artículo no existe");
      }

      return true;
    }),
];

//actualizar article
export const updateArticleValidations = [
  //validar el id del artículo que queremos actualizar
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")
    .custom(async (id) => {
      const article = await ArticleModel.findByPk(id);

      if (!article) {
        throw new Error("El artículo no existe");
      }

      return true;
    }),

  //title opcional al actualizar
  //si viene debe seguir cumpliendo sus reglas
  body("title")
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage("El título debe tener entre 3 y 200 caracteres"),

  //content opcional al actualizar
  //si viene debe tener al menos 50 caracteres
  body("content")
    .optional()
    .isLength({ min: 50 })
    .withMessage("El contenido debe tener al menos 50 caracteres"),

  //excerpt opcional
  body("excerpt")
    .optional()
    .isLength({ max: 500 })
    .withMessage("El excerpt debe tener como máximo 500 caracteres"),

  //status opcional
  body("status")
    .optional()
    .isIn(["published", "archived"])
    .withMessage("El status debe ser published o archived"),
];

//eliminar article por id
export const deleteArticleValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el artículo exista en la base de datos
    .custom(async (id) => {
      const article = await ArticleModel.findByPk(id);

      if (!article) {
        throw new Error("El artículo no existe");
      }

      return true;
    }),
];
