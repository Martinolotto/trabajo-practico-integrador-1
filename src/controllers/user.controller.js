//¿Qué debe hacerse cuando esa petición llegó?

//importamos el modelo para que sequelize lo registre
//y para consultar usuarios desde el controlador 
import { UserModel } from "../models/user.model.js";

// controlador para obtener todos los usuarios 
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll()
        return res.status(200).json(users)

    } catch (error) {

    console.log(error)

    return res.status(500).json({
        message: "Error interno del servidor"

    })
  }
}

//crear usuarios 
export const createUser = async (req, res) => {
    try {
        //obtener los datos que vienen del body
        //desestructuracion 
        const { username, email, password } = req.body;

        //crear un usuario en MySQL
        const user = await UserModel.create({
            username,
            email,
            password
        })

        //reponder con los datos creados del usuario
        return res.status(201).json({
            message: "Usuario creeado correctamente",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}

//obtener usario por id 
export const getUserById = async (req, res) => {
    try {
        //obtener el parametro por la request
        const userId = req.params.id

        //buscamos el user por el id que recibimos
        const user = await UserModel.findByPk(userId)
        
        //si no hay un usuario con ese id
        if (!user) {
            return res.status(404).json({
                message: "Usuario no Encontrado"
            })
        }

        return res.status(200).json({
            message: "Usuario encontrado",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del Servidor"
        })
    }
}

//actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        //obtener el id de la peticion
        const userId = req.params.id;

        //obtener los nuevos datos del body
        //desestructuramos para crear las variables de esas propiedades 
        const { username, email } = req.body

        //guardamos las propiedades con la nueva informacion por actualizar para pasarsela a sequelize
        const userData = {
            username,
            email
        }

        //buscamos el usuario por id
        const user = await UserModel.findByPk(userId)

         //si no hay un usuario con ese id
        if (!user) {
            return res.status(404).json({
                message: "Usuario no Encontrado"
            })
        }

        //actualizamos el registro que encontramos del usaurio existente, con los datos del body que guardamos
        await user.update(userData)
        //console.log(user.username);

        return res.status(200).json({
            message: "Usuario actualizado correctamente",
            //datos actualizados
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del Servidor",
        });
    }
    
}

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
        await user.destroy()
        
        return res.status(200).json({
            message: "Usuario eliminado correctamente"
        })
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del Servidor",
        });
    }
}