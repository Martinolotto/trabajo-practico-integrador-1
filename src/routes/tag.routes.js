/*
 GUIA EXAMEN - TAGS
 Consigna: GET /api/tags -> usuario autenticado.
 GET /api/tags/:id, POST, PUT, DELETE -> solamente ADMIN.
 Todas las rutas privadas pasan primero por authMiddleware.
 Cada ruta que recibe datos tiene su validación Express Validator y validate.
*/
import { Router } from "express";
import { getAllTags, getTagById, createTag, updateTag, deleteTag } from "../controllers/tag.controller.js";
import { createTagValidations, getTagByIdValidations, updateTagValidations, deleteTagValidations } from "../middlewares/tag.validation.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
export const tagRouter = Router();

//Cualquier ruta de tags requiere login.
tagRouter.use("/tags", authMiddleware);
//Solo lista general accesible a usuario autenticado.
tagRouter.get("/tags", getAllTags);
//En las siguientes rutas se exige también autorización admin.
tagRouter.post("/tags", adminMiddleware, createTagValidations, validate, createTag);
tagRouter.get("/tags/:id", adminMiddleware, getTagByIdValidations, validate, getTagById);
tagRouter.put("/tags/:id", adminMiddleware, updateTagValidations, validate, updateTag);
tagRouter.delete("/tags/:id", adminMiddleware, deleteTagValidations, validate, deleteTag);
