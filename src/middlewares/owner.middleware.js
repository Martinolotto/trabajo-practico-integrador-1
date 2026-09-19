/*
 GUIA EXAMEN - AUTORIZACION DE PROPIEDAD
 1) authMiddleware ejecutó jwt.verify, consultó Users y creó req.user.
 2) validate ya comprobó formato de ID (evitar consultas innecesarias).
 3) Elegimos la fuente del artículo a proteger:
    - source: "params" => PUT/DELETE /articles/:id
    - source: "body" => POST /articles-tags con article_id en el JSON
    - source: "articleTag" => DELETE /articles-tags/:articleTagId;
      primero buscamos la fila del puente y obtenemos su article_id.
 4) Buscamos Article por ID. Si no existe => HTTP 404.
 5) Comparamos article.user_id con req.user.id (NUNCA confiar en role del body).
 6) Si es dueño o se admite un admin => next; si no => 403.
 `ownerMiddleware(...)` es una FABRICA de middlewares: devuelve (req,res,next).
*/
import { ArticleModel } from "../models/article.model.js";
import { ArticleTagModel } from "../models/article.tag.model.js";

export const ownerMiddleware = ({ source = "params", allowAdmin = true } = {}) => {
  return async (req, res, next) => {
    try {
      let articleId;

      if (source === "articleTag") {
        //Obtener relación de ArticleTag para averiguar a qué artículo pertenece.
        const link = await ArticleTagModel.findByPk(req.params.articleTagId);
        if (!link) return res.status(404).json({ message: "Relación no encontrada" });
        articleId = link.article_id;
      } else if (source === "body") {
        //En POST /articles-tags el ID del artículo está en req.body.
        articleId = req.body.article_id;
      } else {
        //En PUT/DELETE /articles/:id el ID está en req.params.
        articleId = req.params.id;
      }

      const article = await ArticleModel.findByPk(articleId);
      if (!article) return res.status(404).json({ message: "Artículo no encontrado" });

      //Comparamos números porque req.params normalmente son strings.
      const isOwner = Number(article.user_id) === Number(req.user.id);
      const isAdmin = allowAdmin && req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: "No sos autor de este artículo" });
      }

      //Guardar el artículo por si el controller quiere reutilizarlo.
      req.resourceArticle = article;
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al verificar propiedad" });
    }
  };
};
