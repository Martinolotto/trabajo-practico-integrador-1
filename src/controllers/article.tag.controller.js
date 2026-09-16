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