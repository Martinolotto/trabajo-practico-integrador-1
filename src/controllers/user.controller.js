//¿Qué debe hacerse cuando esa petición llegó?

//importamos el modelo para que sequelize lo registre
//y para consultar usuarios desde el controlador 
import { UserModel } from "../models/user.model.js";

// controlador para obtener todos los usuarios 
export const getUsers = async (req, res) => {
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
