//importar router
import { Router } from "express";

import {
//   getAllUsers,
    createArticleTag,
//   getUserById,
//   updateUser,
//   deleteUser,
} from "../controllers/article.tag.controller.js";

//enrutador agrupa las rutas de user
export const articleTagRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);
articleTagRouter.post("/articles-tags", createArticleTag);
// userRouter.get("/users/:id", getUserById);
// userRouter.put("/users/:id", updateUser);
// userRouter.delete("/users/:id", deleteUser);
