//modelo donde hacemos las consultas
import { ArticleTagModel } from "../models/article.tag.model.js";
//importamos matchedData para trabajar solamente con los datos enviados y validados
import { matchedData } from "express-validator";

//crear la relacion entre articulo y tag
export const createArticleTag = async (req, res) => {
  try {
    //obtener los datos del body
    //obtener solamente los datos validados que vienen del body
    const { article_id, tag_id } = matchedData(req, {
      locations: ["body"],
    });

    //crear un articletag
    const articleTag = await ArticleTagModel.create({
      article_id,
      tag_id,
    });

    //response ok
    return res.status(201).json({
      message: "Etiqueta agregada al aritculo correctamente",
      articleTag: {
        id: articleTag.id,
        article_id: articleTag.article_id,
        tag_id: articleTag.tag_id,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//borrar relacion entre articulo y tag, solo la fila intermedia
export const deleteArticleTag = async (req, res) => {
  try {
    //obtener el id de la peticion
    //obtener solamente el parametro que fue validado
    const { articleTagId } = matchedData(req, {
      locations: ["params"],
    });

    //buscamos la relacion por id
    const articleTag = await ArticleTagModel.findByPk(articleTagId);

    //si no hay una relacion con ese id
    if (!articleTag) {
      return res.status(404).json({
        message: "Relación no encontrada",
      });
    }

    //borramos todo el registro que ya identificamos
    await articleTag.destroy();

    return res.status(200).json({
      message: "etiqueta retirada del artículo correctamente",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del Servidor",
    });
  }
};
