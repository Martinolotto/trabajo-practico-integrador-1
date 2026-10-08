/*
 GUIA EXAMEN - PERFIL
 El flujo PRINCIPAL que pide la consigna es /api/auth/profile (GET/PUT).
 El POST /api/profiles era una ruta antigua y permitía crear perfiles de terceros.
 Para no romperla ni dejarla pública, la protegemos como SOLO ADMIN.
 El POST /api/auth/register ya crea el perfil automáticamente en transacción.
*/
import { Router } from "express";
import { createProfile } from "../controllers/profile.controller.js";
import { createProfileValidations } from "../middlewares/profile.validation.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
export const profileRouter = Router();
profileRouter.post("/profiles", authMiddleware, adminMiddleware, createProfileValidations, validate, createProfile);
