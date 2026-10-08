/*
 GUIA EXAMEN - ROUTER DE ARTÍCULOS
 1) El JWT identifica al usuario -> authMiddleware crea req.user.
 2) GET /articles lista publicados; GET /articles/user lista MIS publicados.
 3) Antes de /:id registrar /user y /user/:id (evitar colisiones de rutas).
 4) POST usa req.user.id como autor; nunca body.user_id.
 5) PUT/DELETE autor o admin, verificar con ownerMiddleware.
 6) Orden de una ruta protegida con params:
    auth -> validaciones -> validate -> owner -> controller.
*/
import { Router } from "express";
import { createArticle, getAllArticles, getArticleById, getMyArticles, getMyArticleById, updateArticle, deleteArticle } from "../controllers/article.controller.js";
import { createArticleValidations, getArticleByIdValidations, getOwnArticleByIdValidations, updateArticleValidations, deleteArticleValidations } from "../middlewares/article.validation.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ownerMiddleware } from "../middlewares/owner.middleware.js";
export const articleRouter = Router();
//Todas las rutas /articles requieren login.
articleRouter.use("/articles", authMiddleware);
articleRouter.post("/articles", createArticleValidations, validate, createArticle);
articleRouter.get("/articles", getAllArticles);
//IMPORTANTE: ruta específica /user antes de la genérica /:id.
articleRouter.get("/articles/user", getMyArticles);
articleRouter.get("/articles/user/:id", getOwnArticleByIdValidations, validate, getMyArticleById);
articleRouter.get("/articles/:id", getArticleByIdValidations, validate, getArticleById);
articleRouter.put("/articles/:id", updateArticleValidations, validate, ownerMiddleware(), updateArticle);
articleRouter.delete("/articles/:id", deleteArticleValidations, validate, ownerMiddleware(), deleteArticle);
