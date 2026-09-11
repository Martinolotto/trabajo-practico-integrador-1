//importar router
import { Router } from "express";

import {
//   getAllUsers,
  createArticle,
//   getUserById,
//   updateUser,
//   deleteUser,
} from "../controllers/article.controller.js";

//enrutador agrupa las rutas de user
export const articleRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);
articleRouter.post("/articles", createArticle);
// userRouter.get("/users/:id", getUserById);
// userRouter.put("/users/:id", updateUser);
// userRouter.delete("/users/:id", deleteUser);
