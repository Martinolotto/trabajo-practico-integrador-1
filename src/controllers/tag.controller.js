/* GUIA EXAMEN: Tags GET lista para autenticados; POST/GET:id/PUT/DELETE solo admin.
   DELETE físico limpia ArticleTag en la MISMA transacción, sin borrar Article. */
//modelo donde hacemos las consultas
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { ArticleTagModel } from "../models/article.tag.model.js";
import { sequelize } from "../config/database.js";
//importamos matchedData para trabajar solamente con los datos enviados y validados
import { matchedData } from "express-validator";

//crear tag Y desde Article quiero llamar a los relacionados tags
export const createTag = async (req, res) => {
  try {
    //obtener los datos del body
    //usamos solamente los datos validados que vienen del body
    const { name } = matchedData(req, { locations: ["body"] });

    //crear un articulo
    const tag = await TagModel.create({
      name,
    });

    //response ok
    return res.status(201).json({
      message: "etiqueta creada correctamente",
      tag: {
        id: tag.id,
        name: tag.name,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//obtener todos los tags
export const getAllTags = async (req, res) => {
  try {
    //buscar todos los tags
    const tags = await TagModel.findAll();

    return res.status(200).json(tags);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//obtener tag por id
export const getTagById = async (req, res) => {
  try {
    const TagId = req.params.id;

    const tag = await TagModel.findByPk(TagId, {
      include: [
        {
          model: ArticleModel,
          as: "articles",
        },
      ],
    });

    if (!tag) {
      return res.status(404).json({
        message: "tag no encontrado",
      });
    }

    return res.status(200).json({
      message: "Tag encontrado",
      tag: {
        id: tag.id,
        name: tag.name,
        articles: tag.articles,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//actualizar tag
export const updateTag = async (req, res) => {
  try {
    //obtener el id de la peticion
    const tagId = req.params.id;

    //obtener solamente los datos validados que vienen del body
    //no incluimos el param id porque solo lo usamos para identificar que tag actualizar
    const tagData = matchedData(req, { locations: ["body"] });

    //buscar el tag por id
    const tag = await TagModel.findByPk(tagId);

    //si no hay un tag con ese id
    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    //actualizar el tag encontrado con los datos enviados y validados
    await tag.update(tagData);

    return res.status(200).json({
      message: "Tag actualizado correctamente",
      tag: {
        id: tag.id,
        name: tag.name,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//eliminar tag
export const deleteTag = async (req, res) => {
  try {
    //obtener el id de la peticion
    const tagId = req.params.id;

    //buscar el tag por id
    const tag = await TagModel.findByPk(tagId);

    //si no hay un tag con ese id
    if (!tag) {
      return res.status(404).json({
        message: "Tag no encontrado",
      });
    }

    //eliminar el tag encontrado
    //Transacción atómica: eliminar los vínculos del puente y luego Tag.
    //No se eliminan los artículos que utilizaban esta etiqueta.
    await sequelize.transaction(async (transaction) => {
      await ArticleTagModel.destroy({ where: { tag_id: tag.id }, transaction });
      await tag.destroy({ transaction }); // Borrado físico: Tag no tiene paranoid.
    });

    return res.status(200).json({
      message: "Tag eliminado correctamente",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};
