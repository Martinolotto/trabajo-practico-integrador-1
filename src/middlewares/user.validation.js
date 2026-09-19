// validaciones para user
// username
// 3-20 caracteres
// alfanumérico
// único custom

// email
// formato válido
// único custom

// password
// mínimo 8
// una mayúscula
// una minúscula
// un número

// role
// user o admin custom
import { body, param } from "express-validator";
import { UserModel } from "../models/user.model.js";

//crear user
export const createUserValidations = [
  //validar username que viene por el body
  body("username")
    .notEmpty() //no vacio
    .withMessage("El username es obligatorio")
    .isLength({ min: 3, max: 20 }) //largo
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric() //alfanumerico
    .withMessage("El username debe ser alfanumérico")

    .custom(
      //user unico
      //recibimos el username
      async (username) => {
        const user = await UserModel.findOne({
          //buscar un user con el mismo username
          where: { username },
        });

        //si user existe, osea da true
        if (user) {
          throw new Error("el username debe ser único");
        }

        //sino
        return true;
      },
    ),

  // email obligatorio, formato válido y único
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email debe tener un formato válido")
    .custom(async (email) => {
      const user = await UserModel.findOne({
        where: { email },
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  // password mínimo 8  mayúscula  minúscula número
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener un número"),

  // role es opcional porque el modelo ya tiene user por defecto.
  // Si viene, solo puede ser user o admin.
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El role debe ser user o admin"),
];

//obtener user por id
export const getUserByIdValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el usuario exista en la base de datos
    .custom(async (id) => {
      const userId = await UserModel.findByPk(id);

      if (!userId) {
        throw new Error("el usuario no existe");
      }

      return true;
    }),
];

//actualizar user
export const updateUserValidations = [
  //validar el id del usuario que queremos actualizar
  param("id")
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")
    .custom(async (id) => {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error("el usuario no existe");
      }

      return true;
    }),

  //username opcional, pero si viene debe cumplir las mismas reglas
  body("username")
    .optional()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .isAlphanumeric()
    .withMessage("El username debe ser alfanumérico")

    //comprobar que el username no pertenezca a otro usuario
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({
        where: { username },
      });

      //si existe y pertenece a otro usuario, no se puede usar
      if (user && user.id !== Number(req.params.id)) {
        throw new Error("El username ya está registrado");
      }

      return true;
    }),

  //email opcional, pero si viene debe tener formato válido y ser único
  body("email")
    .optional()
    .isEmail()
    .withMessage("El email debe tener un formato válido")
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({
        where: { email },
      });

      //si existe y pertenece a otro usuario, no se puede usar
      if (user && user.id !== Number(req.params.id)) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  //password opcional al actualizar
  //si viene debe seguir cumpliendo las reglas de password
  body("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener una mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener una minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener un número"),

  //role opcional al actualizar
  //si viene solo puede ser user o admin
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El role debe ser user o admin"),
];

//eliminar user por id
export const deleteUserValidations = [
  param("id")
    //el id tiene que ser un entero positivo
    .isInt({ min: 1 })
    .withMessage("El id debe ser un número entero positivo")

    //comprobar que el usuario exista en la base de datos
    .custom(async (id) => {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error("el usuario no existe");
      }

      return true;
    }),
];
