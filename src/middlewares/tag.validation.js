//validaciones para tag
//name
//2-30 caracteres
//único custom
//sin espacios

import { body, param } from "express-validator";
import { TagModel } from "../models/tag.model.js";

//crear tag
export const createTagValidations = [
  //validar name que viene por el body
  body("name")
    .notEmpty()
    .withMessage("El nombre del tag es obligatorio")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre del tag debe tener entre 2 y 30 caracteres")
    .matches(/^\S+$/)
    .withMessage("El nombre del tag no puede contener espacios")

    //comprobar que el nombre sea único
    .custom(async (name) => {
      const tag = await TagModel.findOne({
        where: { name },
      });

      //si encontramos un tag con el mismo nombre
      if (tag) {
        throw new Error("El nombre del tag ya está registrado");
      }

      return true;
    }),
];

//obtener tag por id
export const getTagByIdValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el tag exista en la base de datos
    .custom(async (id) => {
      const tag = await TagModel.findByPk(id);

      if (!tag) {
        throw new Error("El tag no existe");
      }

      return true;
    }),
];

//actualizar tag
export const updateTagValidations = [
  //validar el id del tag que queremos actualizar
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")
    .custom(async (id) => {
      const tag = await TagModel.findByPk(id);

      if (!tag) {
        throw new Error("El tag no existe");
      }

      return true;
    }),

  //name es opcional al actualizar
  //si viene debe seguir cumpliendo las reglas del tag
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre del tag no debe estar vacío")
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre del tag debe tener entre 2 y 30 caracteres")
    .matches(/^\S+$/)
    .withMessage("El nombre del tag no puede contener espacios")

    //comprobar que el nombre no pertenezca a otro tag
    .custom(async (name, { req }) => {
      const tag = await TagModel.findOne({
        where: { name },
      });

      //si existe y pertenece a otro tag, no se puede usar
      if (tag && tag.id !== Number(req.params.id)) {
        throw new Error("El nombre del tag ya está registrado");
      }

      return true;
    }),
];

//eliminar tag por id
export const deleteTagValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el tag exista en la base de datos
    .custom(async (id) => {
      const tag = await TagModel.findByPk(id);

      if (!tag) {
        throw new Error("El tag no existe");
      }

      return true;
    }),
];
