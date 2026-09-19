/*
 GUIA EXAMEN - TABLA PUENTE ArticleTag
 POST agrega tag a artículo. DELETE elimina una asociación específica.
 CONSIGNA: solo el autor del ARTÍCULO, incluso si otro usuario es admin.
 1) auth: identificar usuario; 2) validar IDs; 3) owner: comparar con autor
 4) controller: realizar la operación en MySQL.
*/
import { Router } from "express";
import { createArticleTag, deleteArticleTag } from "../controllers/article.tag.controller.js";
import { createArticleTagValidations, deleteArticleTagValidations } from "../middlewares/article.tag.validation.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
export const articleTagRouter = Router();
articleTagRouter.post("/articles-tags", authMiddleware, createArticleTagValidations, validate, ownerMiddleware({ source: "body", allowAdmin: false }), createArticleTag);
articleTagRouter.delete("/articles-tags/:articleTagId", authMiddleware, deleteArticleTagValidations, validate, ownerMiddleware({ source: "articleTag", allowAdmin: false }), deleteArticleTag);
