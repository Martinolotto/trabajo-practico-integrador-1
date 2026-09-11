//modelo donde hacemos las consultas
import { TagModel } from "../models/tag.model.js";

//crear articulo

export const createTag = async (req, res) => {
  try {
    //obtener los datos del body
    const { name } = req.body;

    //crear un articulo
    const tag = await TagModel.create({
        name
    });

    //response ok
    return res.status(201).json({
      message: "etiqueta creada correctamente",
        tag: {
        id: tag.id,
        name: tag.name
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
