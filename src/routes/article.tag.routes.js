//importar router
import { Router } from "express";

import {
  //   getAllUsers,
  createArticleTag,
  //   getUserById,
  //   updateUser,
  deleteArticleTag,
} from "../controllers/article.tag.controller.js";

import {
  createArticleTagValidations,
  deleteArticleTagValidations,
} from "../middlewares/article.tag.validation.js";

import { validate } from "../middlewares/validate.js";

//enrutador agrupa las rutas de user
export const articleTagRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);

articleTagRouter.post(
  "/articles-tags",
  createArticleTagValidations,
  validate,
  createArticleTag,
);

// userRouter.get("/users/:id", getUserById);
// userRouter.put("/users/:id", updateUser);

articleTagRouter.delete(
  "/articles-tags/:articleTagId",
  deleteArticleTagValidations,
  validate,
  deleteArticleTag,
);
