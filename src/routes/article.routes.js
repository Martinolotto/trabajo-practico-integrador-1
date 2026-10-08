//importar router
import { Router } from "express";

import {
  //   getAllUsers,
  createArticle,
  getArticleById,
  //   updateUser,
  deleteArticle
  
} from "../controllers/article.controller.js";

import {
  createArticleValidations,
  getArticleByIdValidations,
  deleteArticleValidations
} from "../middlewares/article.validation.js";

import { validate } from "../middlewares/validate.js";

//enrutador agrupa las rutas de user
export const articleRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);

articleRouter.post(
  "/articles",
  createArticleValidations,
  validate,
  createArticle,
);

articleRouter.get(
  "/articles/:id",
  getArticleByIdValidations,
  validate,
  getArticleById,
);

// userRouter.put("/users/:id", updateUser);

//eliminar artículo por id
articleRouter.delete(
  "/articles/:id",
  deleteArticleValidations,
  validate,
  deleteArticle
);