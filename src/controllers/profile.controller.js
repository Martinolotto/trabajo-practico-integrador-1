import { ProfileModel } from "../models/profile.model.js";


//crear perfil
export const createProfile = async (req, res) => {
    try {
        //obtener los datos que vienen del body
        //desestructuracion 
        const { user_id, first_name, last_name, biography, avatar_url, birth_date } = req.body;

        //crear un perfil en MySQL
        const profile = await ProfileModel.create({
          user_id,
          first_name,
          last_name,
          biography,
          avatar_url,
          birth_date,
        });

        //reponder con los datos creados del perfil
        return res.status(201).json({
          message: "Perfil creado correctamente",
          profile: {
            id: profile.id,
            user_id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            biography: profile.biography,
            avatar_url: profile.avatar_url,
            birth_date: profile.birth_date
          },
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}