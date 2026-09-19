/*
 GUIA EXAMEN - VALIDAR RELACION ARTICULO/ETIQUETA
 El cliente pide crear una fila intermedia con article_id y tag_id.
 Solo el AUTOR del artículo puede vincular o desvincular tags (no admin ajeno).
 body() lee JSON. param() lee variables de URL. custom() consulta MySQL.
 No autorizamos acá: se hace en ownerMiddleware después de validar.
*/
import { body, param } from "express-validator";
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
export const createArticleTagValidations = [
  body("article_id").isInt({ min: 1 }).withMessage("article_id debe ser entero positivo")
    .custom(async id => {
      if (!await ArticleModel.findByPk(id)) throw new Error("El artículo no existe");
      return true;
    }),
  body("tag_id").isInt({ min: 1 }).withMessage("tag_id debe ser entero positivo")
    .custom(async id => {
      if (!await TagModel.findByPk(id)) throw new Error("El tag no existe");
      return true;
    })
];
export const deleteArticleTagValidations = [
  param("articleTagId").isInt({ min: 1 }).withMessage("articleTagId debe ser entero positivo")
];
