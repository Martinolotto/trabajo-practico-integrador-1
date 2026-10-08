//¿Qué debe hacerse cuando esa petición llegó?

//importamos el modelo para que sequelize lo registre
//y para consultar usuarios desde el controlador
import { ProfileModel } from "../models/profile.model.js";
import { UserModel } from "../models/user.model.js";
import { ArticleModel } from "../models/article.model.js";
//importamos matchedata de expvalidator para trabajar con los datos que nosotros pedimos y validamos
import { matchedData } from "express-validator";

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

    //crear un usuario en MySQL
    const user = await UserModel.create({
      username,
      email,
      password,
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
    //obtener el id de la peticion
    const userId = req.params.id;

    //obtener los nuevos datos del body
    //desestructuramos para crear las variables de esas propiedades
    //con matchedData usamos solamente los campos que fueron enviados y validados
    //obtener solamente los datos validados que vienen del body
    //no incluimos el param id porque solo lo usamos para identificar que usuario actualizar
    const userData = matchedData(req, { locations: ["body"] });

    //guardamos las propiedades con la nueva informacion por actualizar para pasarsela a sequelize

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
