//importar router
import { Router } from "express";
//importar validaciones y validate para crear user
import {
  createUserValidations,
  getUserByIdValidations,
  updateUserValidations,
  deleteUserValidations,
} from "../middlewares/user.validation.js";
import { validate } from "../middlewares/validate.js";

//importar controladores
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

userRouter.post(
  "/users",
  createUserValidations,
  validate,
  createUser
);

userRouter.get(
  "/users/:id",
  getUserByIdValidations,
  validate,
  getUserById
);

userRouter.put(
  "/users/:id",
  updateUserValidations,
  validate,
  updateUser
);

userRouter.delete(
  "/users/:id",
  deleteUserValidations,
  validate,
  deleteUser
);