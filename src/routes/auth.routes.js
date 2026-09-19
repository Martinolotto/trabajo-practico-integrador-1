/*
 * GUIA DEL EXAMEN — RUTAS DE AUTENTICACION
 * El archivo SOLO define endpoints y orden de middlewares, no hace SQL.
 * Recorrido publico: ruta -> validaciones -> validate -> controlador.
 * Recorrido privado: ruta -> authMiddleware -> validaciones si hay
 *                   -> validate -> controlador.
 * - POST /auth/register: publico, crea User + Profile, devuelve 201.
 * - POST /auth/login: publico, verifica clave y entrega JWT en cookie.
 * - GET /auth/profile: privado; authMiddleware carga req.user.
 * - PUT /auth/profile: privado; valida los campos a actualizar.
 * - POST /auth/logout: privado; limpia la cookie.
 * Este router se monta con app.use('/api', authRouter), por eso URL final
 * es /api/auth/... y NO solamente /auth/...
 * El nombre 'auth' incluye login, registro y sesion; NO significa que
 * todos sus endpoints deban requerir token (login/registro son publicos).
 */

import { Router } from "express";

import {
  register,
  login,
  getAuthProfile,
  updateAuthProfile,
  logout,
} from "../controllers/auth.controller.js";

import {
  registerValidations,
  loginValidations,
  updateProfileValidations,
} from "../middlewares/auth.validation.js";

import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

// Instancia que agrupa solo las rutas /auth. Luego app.js agrega /api.
export const authRouter = Router();

//Rutas públicas: no requieren JWT.
authRouter.post("/auth/register", registerValidations, validate, register);
authRouter.post("/auth/login", loginValidations, validate, login);

//Rutas privadas: requieren usuario autenticado.
// Protegida: primero JWT y req.user, despues controlador.
authRouter.get("/auth/profile", authMiddleware, getAuthProfile);

authRouter.put(
  "/auth/profile",
  authMiddleware,
  updateProfileValidations,
  validate,
  updateAuthProfile,
);

authRouter.post("/auth/logout", authMiddleware, logout);
