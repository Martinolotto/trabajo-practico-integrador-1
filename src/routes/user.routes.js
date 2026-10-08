/*
 GUIA EXAMEN - RUTAS DE USUARIOS
 Consigna: GET/POST/PUT/DELETE /api/users es SOLO ADMIN.
 Orden: request -> app.js -> router -> authMiddleware (401)
 -> adminMiddleware (403) -> validaciones (400) -> controlador -> Sequelize.
 La creación pública de cuentas es POST /api/auth/register, NO /api/users.
*/
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
  createUserValidations, getUserByIdValidations,
  updateUserValidations, deleteUserValidations
} from "../middlewares/user.validation.js";
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

export const userRouter = Router();
//Aplicar ambos middlewares a cualquier método que empiece por /users.
//El rol se toma de req.user consultado en MySQL, no de req.body.
userRouter.use("/users", authMiddleware, adminMiddleware);

userRouter.get("/users", getAllUsers);
userRouter.post("/users", createUserValidations, validate, createUser);
userRouter.get("/users/:id", getUserByIdValidations, validate, getUserById);
userRouter.put("/users/:id", updateUserValidations, validate, updateUser);
userRouter.delete("/users/:id", deleteUserValidations, validate, deleteUser);
