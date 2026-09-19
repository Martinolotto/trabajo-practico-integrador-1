//importar router
import { Router } from "express";

import {
//   getAllUsers,
  createArticle,
  getArticleById,
//   updateUser,
//   deleteUser,
} from "../controllers/article.controller.js";

//enrutador agrupa las rutas de user
export const articleRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);
articleRouter.post("/articles", createArticle);
articleRouter.get("/articles/:id", getArticleById);
// userRouter.put("/users/:id", updateUser);
// userRouter.delete("/users/:id", deleteUser);
