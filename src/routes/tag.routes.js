//importar router
import { Router } from "express";

import {
    //   getAllUsers,
    createTag
  //   getUserById,
  //   updateUser,
  //   deleteUser,
} from "../controllers/tag.controller.js";

//enrutador agrupa las rutas de user
export const tagRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);
tagRouter.post("/tag", createTag);
// userRouter.get("/users/:id", getUserById);
// userRouter.put("/users/:id", updateUser);
// userRouter.delete("/users/:id", deleteUser);
