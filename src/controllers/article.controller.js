//modelo donde hacemos las consultas
import { ArticleModel } from "../models/article.model.js";

//crear articulo 

export const createArticle = async (req, res) => {
    try {
        //obtener los datos del body
        const { title, content, excerpt, status, user_id } = req.body
        
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
                excerpt:article.excerpt, 
                status: article.status,
                user_id: article.user_id,
            }
        })

        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        })
    }
    
}