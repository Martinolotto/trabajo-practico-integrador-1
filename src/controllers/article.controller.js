//modelo donde hacemos las consultas
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { UserModel } from "../models/user.model.js";
//importamos matchedData para trabajar solamente con los datos enviados y validados
import { matchedData } from "express-validator";
//imports para eliminacion cascada
import { ArticleTagModel } from "../models/article.tag.model.js";
import { sequelize } from "../config/database.js";

//crear articulo

export const createArticle = async (req, res) => {
  try {
    //obtener los datos del body
    //obtener solamente los datos validados que vienen del body
    const { title, content, excerpt, status, user_id } = matchedData(req, {
      locations: ["body"],
    });

    //crear un articulo
    const article = await ArticleModel.create({
      title,
      content,
      excerpt,
      status,
      user_id,
    });

    //response ok
    return res.status(201).json({
      message: "Artículo creado correctamente",
      articulo: {
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        status: article.status,
        user_id: article.user_id,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// obtener articulo por id
export const getArticleById = async (req, res) => {
  try {
    //obtener solamente el id validado que viene por params
    const { id: articleId } = matchedData(req, { locations: ["params"] });

    //buscamos el article por el id que recibimos
    const article = await ArticleModel.findByPk(articleId, {
      //buscamos el tag relacionado con el articulo
      include: [
        {
          model: TagModel,
          //usamos la asociacion que llamamos con el alias
          as: "tags",
        },
        {
          model: UserModel,
          as: "author",
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "artículo no encontrado",
      });
    }

    return res.status(200).json({
      message: "Artículo encontrado",
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        //respondemos los datos de los articulos asociados a ese tag
        tags: article.tags,
        author: article.author,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//eliminar artículo de forma lógica
//también eliminamos físicamente sus relaciones con tags
export const deleteArticle = async (req, res) => {
  try {
    //obtener el id validado desde los parámetros
    const { id } = matchedData(req, {
      locations: ["params"]
    });

    //buscar el artículo que queremos eliminar
    const article = await ArticleModel.findByPk(id);

    if (!article) {
      return res.status(404).json({
        message: "Artículo no encontrado"
      });
    }

    //transacción: ambas operaciones deben completarse
    //si una falla, se revierten los cambios de la otra
    await sequelize.transaction(async (transaction) => {

      //eliminamos las filas de la tabla intermedia
      await ArticleTagModel.destroy({
        where: { article_id: article.id },
        transaction
      });

      //paranoid hace que esta eliminación sea lógica
      await article.destroy({ transaction });
    });

    return res.status(200).json({
      message: "Artículo eliminado correctamente"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};