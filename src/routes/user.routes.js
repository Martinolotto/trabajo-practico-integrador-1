//¿Qué función debe ejecutarse para esta combinación de método HTTP + URL?
//importar router
import { Router } from "express";

import { getUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

//enrutador agrupa las rutas de user
export const userRouter = Router()

//rutas
userRouter.get("/users", getUsers)
userRouter.post("/users", createUser)
userRouter.get("/users/:id", getUserById)
userRouter.put("/users/:id", updateUser)
userRouter.delete("/users/:id", deleteUser);