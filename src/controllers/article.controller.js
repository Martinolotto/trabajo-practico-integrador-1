/*
 GUIA EXAMEN - CRUD DE ARTÍCULOS
 Consigna:
 POST /api/articles => usuario autenticado crea su propio artículo.
 GET /api/articles => artículos published; GET /:id => detalle + tags/autor.
 GET /api/articles/user => artículos published del logueado.
 GET /api/articles/user/:id => un artículo publicado propio.
 PUT/DELETE /api/articles/:id => solamente autor o admin.
 DELETE: paranoid en Article marca deleted_at; limpiar ArticleTags físicamente.
 req.user: lo crea authMiddleware tras verificar JWT y consultar MySQL.
 matchedData: toma ÚNICAMENTE campos validados; evita actualizar user_id.
*/
import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { ArticleModel } from "../models/article.model.js";
import { ArticleTagModel } from "../models/article.tag.model.js";
import { TagModel } from "../models/tag.model.js";
import { UserModel } from "../models/user.model.js";

//Respuestas enriquecidas: include con alias IGUAL al de associations.js.
const articleIncludes = [
  { model: TagModel, as: "tags", through: { attributes: [] } },
  { model: UserModel, as: "author", attributes: ["id", "username", "email"] }
];

export const createArticle = async (req, res) => {
  try {
    //PASO 1: recuperar SOLO los campos del body que validamos.
    const data = matchedData(req, { locations: ["body"] });
    //PASO 2: asegurar autor real desde JWT verificado, NO desde el body.
    const article = await ArticleModel.create({ ...data, user_id: req.user.id });
    return res.status(201).json({ message: "Artículo creado correctamente", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear artículo" });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    //Solo publicados, no archivados. Paranoid excluye borrados lógicamente.
    const articles = await ArticleModel.findAll({
      where: { status: "published" }, include: articleIncludes
    });
    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al listar artículos" });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const article = await ArticleModel.findByPk(id, { include: articleIncludes });
    if (!article) return res.status(404).json({ message: "Artículo no encontrado" });
    return res.status(200).json({ message: "Artículo encontrado", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener artículo" });
  }
};

export const getMyArticles = async (req, res) => {
  try {
    //Filtramos por el ID AUTENTICADO, no por un ID elegido por el cliente.
    const articles = await ArticleModel.findAll({
      where: { user_id: req.user.id, status: "published" }, include: articleIncludes
    });
    return res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al listar mis artículos" });
  }
};

export const getMyArticleById = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    //Una sola consulta exige simultáneamente ID, autor y published.
    const article = await ArticleModel.findOne({
      where: { id, user_id: req.user.id, status: "published" }, include: articleIncludes
    });
    if (!article) return res.status(404).json({ message: "Artículo propio no encontrado" });
    return res.status(200).json({ article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener mi artículo" });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    //Nunca aceptar user_id en una edición: cambiaría el propietario.
    const data = matchedData(req, { locations: ["body"] });
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No enviaste campos para actualizar" });
    }
    //El middleware owner ya autorizó la operación; buscamos el modelo para editar.
    const article = req.resourceArticle || await ArticleModel.findByPk(id);
    if (!article) return res.status(404).json({ message: "Artículo no encontrado" });
    await article.update(data);
    return res.status(200).json({ message: "Artículo actualizado", article });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar artículo" });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = matchedData(req, { locations: ["params"] });
    const article = req.resourceArticle || await ArticleModel.findByPk(id);
    if (!article) return res.status(404).json({ message: "Artículo no encontrado" });

    //UNA TRANSACCIÓN: o se limpian ArticleTags y se marca el artículo,
    //o si falla una parte se hace ROLLBACK de todo.
    await sequelize.transaction(async (transaction) => {
      //El vínculo se elimina físicamente, NO se eliminan Tags.
      await ArticleTagModel.destroy({ where: { article_id: id }, transaction });
      //Con paranoid:true -> UPDATE deleted_at, conserva la fila del artículo.
      await article.destroy({ transaction });
    });

    return res.status(200).json({ message: "Artículo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar artículo" });
  }
};
