//modelo donde hacemos las consultas
import { ArticleTagModel } from "../models/article.tag.model.js";

//crear articulo y tag
export const createArticleTag = async (req, res) => {
    try {
        //obtener los datos del body
        const { article_id, tag_id } = req.body
        
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
            }
        })

        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        })
    }
}

//borrar relacion entre articulo y tag
export const deleteArticleTag = async (req, res) => {
    try {
        //obtener el id de la peticion
        const articleTagId = req.params.articleTagId;

        //buscamos la relacion por id
        const articleTag = await ArticleTagModel.findByPk(articleTagId);

        //si no hay una relacion con ese id
        if (!articleTag) {
            return res.status(404).json({
                message: "Relación no encontrada",
            });
        }

        //borramos todo el registro que ya identificamos
        await articleTag.destroy()
        
        return res.status(200).json({
            message: "etiqueta retirada del artículo correctamente"
        })
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del Servidor",
        });
    }
}