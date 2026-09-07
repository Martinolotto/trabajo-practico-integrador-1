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
