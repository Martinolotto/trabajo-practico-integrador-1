/*
 * GUIA DEL EXAMEN — VALIDACIONES DE REQUEST PARA AUTH
 * Estas reglas NO autentican; solo verifican formato y unicidad de campos.
 * Luego el middleware validate junta errores: 400 si hay alguno, next si no.
 * registerValidations = ...createUserValidations + first_name + last_name.
 * Los tres puntos (...) EXPANDEN los elementos del array de validaciones
 * existentes; no tenemos que copiar todas esas reglas otra vez.
 * Registrar perfil necesita nombre y apellido ademas de los campos de User.
 * loginValidations solo comprueba formato de email y presencia de password:
 * la comprobacion REAL de credenciales ocurre en auth.controller/login.
 * updateProfileValidations usa optional para PUT parcial: solo se validan
 * los campos enviados. matchedData devuelve solo valores validados.
 * Nota: createUserValidations admite role opcional, pero el controlador
 * public register FUERZA role:"user" y descarta role del body.
 */

import { body } from "express-validator";
import { createUserValidations } from "./user.validation.js";


//Estas reglas se aplican en auth.routes.js ANTES del controlador.
//Importamos createUserValidations del archivo user.validation.js de nuestro TP.


//Registro: validaciones de User + nombre y apellido del Profile.
export const registerValidations = [
  // Spread: inserta cada validacion de createUserValidations en este array.
  //No permitir ni aceptar role del cliente en registro público.
  //La regla de role era opcional en createUserValidations de admin.
  ...createUserValidations.slice(0, -1),

  body("first_name").isLength({ min: 2, max: 50 }).isAlpha("es-ES"),

  body("last_name").isLength({ min: 2, max: 50 }).isAlpha("es-ES"),
];

//Login: solamente necesitamos email y contraseña.
export const loginValidations = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

//Actualizar perfil: todos los campos son opcionales.
export const updateProfileValidations = [
  body("first_name").optional().isLength({ min: 2, max: 50 }).isAlpha("es-ES"),

  body("last_name").optional().isLength({ min: 2, max: 50 }).isAlpha("es-ES"),

  body("biography").optional().isLength({ max: 500 }),
  body("avatar_url").optional().isURL(),
  body("birth_date").optional().isISO8601(),
];
