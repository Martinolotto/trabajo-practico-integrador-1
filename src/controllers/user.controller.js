/*
 * GUIA DEL EXAMEN — CRUD ADMINISTRATIVO DE USERS
 * RUTA: /api/users (la ruta la define user.routes.js).
 * UNA VEZ PROTEGIDO: authMiddleware -> adminMiddleware -> validaciones
 * -> validate -> controlador de esta pagina -> Sequelize -> MySQL.
 *
 * GET ALL: findAll + include Profile; no mostrar password.
 * GET BY ID: req.params.id -> findByPk + include Profile y Articles.
 * POST: matchedData -> bcrypt.hash(password) -> UserModel.create -> 201.
 * PUT: matchedData({locations:["body"]}) evita mezclar ID de la URL;
 *      si cambia password, primero hashearla; buscar, actualizar y 200.
 * DELETE: findByPk -> destroy(); si User tiene paranoid:true,
 *         DELETE LOGICO: setea deleted_at, no borra la fila fisicamente.
 * OJO: que el cliente conozca un ID NO lo habilita a modificar ese usuario.
 */

//¿Qué debe hacerse cuando esa petición llegó?

//importamos el modelo para que sequelize lo registre
//y para consultar usuarios desde el controlador
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";
import { ArticleModel } from "../models/article.model.js";
//importamos matchedata de expvalidator para trabajar con los datos que nosotros pedimos y validamos
import { matchedData } from "express-validator";
//import de nuestro helper para el hash de contraseñas 
import { hashPassword } from "../helpers/bcrypt.helper.js";





// controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: {
        exclude: ["password"],
      },
      include: {
        model: ProfileModel,
        as: "profile",
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//crear usuarios
export const createUser = async (req, res) => {
  try {
    //obtener los datos que vienen del body, solo los que nosotros pedimos y validamos
    //matchedata devuelve un obj nueco con los datos validados de la req
    //desestructuracion
    const { username, email, password, role } = matchedData(req);
    //const datosValidados = matchedData(req)

    //antes de crear el registro
    //Nunca guardar una contraseña directamente en MySQL.
    //Primero obtenemos su hash usando bcrypt.
    // bcrypt consume la password ingresada y devuelve un hash irreversible.
    const passwordHash = await hashPassword(password);

    //crear un usuario en MySQL
    const user = await UserModel.create({
      username,
      email,
      // solo la contraseña hasheada se guarda en el atributo 
      password: passwordHash,
      role,
    });
    //const user = await UserModel.create(datosValidados)

    //reponder con los datos creados del usuario
    return res.status(201).json({
      message: "Usuario creado correctamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//obtener usario por id
export const getUserById = async (req, res) => {
  try {
    //obtener el parametro por la request
    const userId = req.params.id;

    //buscamos el user por el id que recibimos
    const user = await UserModel.findByPk(userId, {
      //buscamos el profile relacionado con el usuario
      include: [
        {
          model: ProfileModel,
          //usamos la asociacion que llamamos con el alias profile
          as: "profile",
        },
        //segunda asociacion
        {
          model: ArticleModel,
          as: "articles",
        },
      ],
    });

    //si no hay un usuario con ese id
    if (!user) {
      return res.status(404).json({
        message: "Usuario no Encontrado",
      });
    }

    return res.status(200).json({
      message: "Usuario encontrado",
      user: {
        //respondemos los datos del user
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        //respondemos los datos del perfil
        profile: user.profile,
        //articulos asociados al usuario
        articles: user.articles,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del Servidor",
    });
  }
};

//actualizar un usuario
export const updateUser = async (req, res) => {
  try {
    //obtener el id de la peticion validado
    const { id: userId } = matchedData(req, { locations: ["params"] });

    //obtener los nuevos datos del body
    //desestructuramos para crear las variables de esas propiedades
    //con matchedData usamos solamente los campos que fueron enviados y validados
    //obtener solamente los datos validados que vienen del body
    //no incluimos el param id porque solo lo usamos para identificar que usuario actualizar
    const userData = matchedData(req, { locations: ["body"] });
    //guardamos las propiedades con la nueva informacion por actualizar para pasarsela a sequelize

    //Si estamos actualizando la contraseña, también debemos hashearla.
    if (userData.password !== undefined) {
      // PUT de password tambien DEBE hashear, si no se guarda texto plano.
      userData.password = await hashPassword(userData.password);
    }
    
    //buscamos el usuario por id
    const user = await UserModel.findByPk(userId);

    //si no hay un usuario con ese id
    if (!user) {
      return res.status(404).json({
        message: "Usuario no Encontrado",
      });
    }

    //actualizamos el registro que encontramos del usaurio existente, con los datos del body que guardamos
    await user.update(userData);
    //console.log(user.username);

    return res.status(200).json({
      message: "Usuario actualizado correctamente",
      //datos actualizados
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del Servidor",
    });
  }
};

//borrar usuario
export const deleteUser = async (req, res) => {
  try {
    //obtener el id de la peticion
    const userId = req.params.id;

    //buscamos el usuario por id
    const user = await UserModel.findByPk(userId);

    //si no hay un usuario con ese id
    if (!user) {
      return res.status(404).json({
        message: "Usuario no Encontrado",
      });
    }

    //borramos todo el registro que ya identificamos
    //eliminación lógica gracias a paranoid en UserModel
    //se marca deleted_at y las consultas normales lo ignoran
    await user.destroy();

    return res.status(200).json({
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del Servidor",
    });
  }
};
