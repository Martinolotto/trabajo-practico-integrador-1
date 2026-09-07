//importar router
import { Router } from "express";

import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

//enrutador agrupa las rutas de user
export const userRouter = Router();

//rutas
userRouter.get("/users", getAllUsers);
userRouter.post("/users", createUser);
userRouter.get("/users/:id", getUserById);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);
