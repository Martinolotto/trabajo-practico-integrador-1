/*
 GUIA EXAMEN - VALIDACIONES DE ARTÍCULOS
 POST: title y content obligatorios. user_id NO se acepta desde el cliente:
 el controlador lo obtiene de req.user.id porque el usuario ya pasó auth.
 PUT: campos opcionales, PERO si vienen deben ser correctos.
 GET/DELETE por ID: validamos enteros positivos con param('id').
 La inexistencia real se maneja como 404 desde el controller/ownerMiddleware.
 Las reglas NO autorizan ni autentican: para eso existen otros middlewares.
*/
import { body, param } from "express-validator";
const titleRule = () => body("title").isLength({ min: 3, max: 200 }).withMessage("Título de 3 a 200 caracteres");
const contentRule = () => body("content").isLength({ min: 50 }).withMessage("Contenido de mínimo 50 caracteres");
const excerptRule = () => body("excerpt").optional().isLength({ max: 500 }).withMessage("Excerpt máximo 500 caracteres");
const statusRule = () => body("status").optional().isIn(["published", "archived"]).withMessage("Estado inválido");
const idRule = () => param("id").isInt({ min: 1 }).withMessage("ID entero positivo requerido");

export const createArticleValidations = [titleRule(), contentRule(), excerptRule(), statusRule()];
export const getArticleByIdValidations = [idRule()];
export const getOwnArticleByIdValidations = [idRule()];
export const updateArticleValidations = [
  idRule(), body("title").optional().isLength({ min: 3, max: 200 }),
  body("content").optional().isLength({ min: 50 }), excerptRule(), statusRule()
];
export const deleteArticleValidations = [idRule()];
