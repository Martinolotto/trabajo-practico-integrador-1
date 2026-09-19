//importar router
import { Router } from "express";

import {
  //   getAllUsers,
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} from "../controllers/tag.controller.js";

import {
  createTagValidations,
  getTagByIdValidations,
  updateTagValidations,
  deleteTagValidations,
} from "../middlewares/tag.validation.js";

import { validate } from "../middlewares/validate.js";

//enrutador agrupa las rutas de user
export const tagRouter = Router();

//rutas
// userRouter.get("/users", getAllUsers);

tagRouter.get("/tags", getAllTags);

tagRouter.post("/tags", createTagValidations, validate, createTag);

tagRouter.get("/tags/:id", getTagByIdValidations, validate, getTagById);

tagRouter.put("/tags/:id", updateTagValidations, validate, updateTag);

tagRouter.delete("/tags/:id", deleteTagValidations, validate, deleteTag);

// userRouter.put("/users/:id", updateUser);
// userRouter.delete("/users/:id", deleteUser);
