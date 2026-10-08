/*
 GUIA EXAMEN - CONTROLADOR DEL PUENTE MUCHOS A MUCHOS
 ArticleTag tiene dos FK: article_id -> Article; tag_id -> Tag.
 Create = agregar asociación (NO crear artículo ni tag).
 Delete = retirar asociación (NO eliminar artículo ni tag).
 ownerMiddleware comprobó ANTES que el usuario es autor del artículo.
*/
import { matchedData } from "express-validator";
import { ArticleTagModel } from "../models/article.tag.model.js";

export const createArticleTag = async (req, res) => {
  try {
    const { article_id, tag_id } = matchedData(req, { locations: ["body"] });
    //Evitar repetir la misma relación (también conviene tener UNIQUE en MySQL).
    const existing = await ArticleTagModel.findOne({ where: { article_id, tag_id } });
    if (existing) return res.status(400).json({ message: "La etiqueta ya está vinculada" });
    //Crear una fila en ArticleTags: solo 2 IDs; NO se crean nuevas entidades.
    const articleTag = await ArticleTagModel.create({ article_id, tag_id });
    return res.status(201).json({ message: "Etiqueta agregada al artículo", articleTag });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "La etiqueta ya está vinculada" });
    }
    return res.status(500).json({ message: "Error al asociar etiqueta" });
  }
};

export const deleteArticleTag = async (req, res) => {
  try {
    const { articleTagId } = matchedData(req, { locations: ["params"] });
    const link = await ArticleTagModel.findByPk(articleTagId);
    if (!link) return res.status(404).json({ message: "Relación no encontrada" });
    //Eliminación FÍSICA de la fila puente, los datos padres permanecen.
    await link.destroy();
    return res.status(200).json({ message: "Etiqueta retirada del artículo" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al quitar etiqueta" });
  }
};
