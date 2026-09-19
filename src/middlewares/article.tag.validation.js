//validaciones para articleTag
//article_id
//entero positivo
//debe existir el articulo

//tag_id
//entero positivo
//debe existir el tag

//articleTagId
//entero positivo
//debe existir la relacion

import { body, param } from "express-validator";
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { ArticleTagModel } from "../models/article.tag.model.js";

//crear relacion entre article y tag
export const createArticleTagValidations = [
  //validar article_id que viene por el body
  body("article_id")
    .notEmpty()
    .withMessage("El article_id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El article_id debe ser un número entero positivo")

    //comprobar que el articulo exista
    .custom(async (article_id) => {
      const article = await ArticleModel.findByPk(article_id);

      if (!article) {
        throw new Error("El artículo no existe");
      }

      return true;
    }),

  //validar tag_id que viene por el body
  body("tag_id")
    .notEmpty()
    .withMessage("El tag_id es obligatorio")
    .isInt({ min: 1 })
    .withMessage("El tag_id debe ser un número entero positivo")

    //comprobar que el tag exista
    .custom(async (tag_id) => {
      const tag = await TagModel.findByPk(tag_id);

      if (!tag) {
        throw new Error("El tag no existe");
      }

      return true;
    }),
];

//eliminar relacion entre article y tag
export const deleteArticleTagValidations = [
  //validar el id de la relacion que queremos eliminar
  param("articleTagId")
    .isInt({ min: 1 })
    .withMessage("El articleTagId debe ser un número entero positivo")

    //comprobar que la relacion exista
    .custom(async (articleTagId) => {
      const articleTag = await ArticleTagModel.findByPk(articleTagId);

      if (!articleTag) {
        throw new Error("La relación entre artículo y tag no existe");
      }

      return true;
    }),
];
