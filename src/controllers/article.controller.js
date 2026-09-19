//modelo donde hacemos las consultas
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";
import { UserModel } from "../models/user.model.js";

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

// obtener articulo por id 
export const getArticleById = async (req, res) => {
  try {
    const articleId = req.params.id

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
            exclude: ["password"]
          }
        }
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "artículo no encontrado"
      })
    }


    return res.status(200).json({
            message: "Artículo encontrado",
            article: {
                id: article.id,
                title: article.title,
                content: article.content,
                //respondemos los datos de los articulos asociados a ese tag
                tags: article.tags,
                author: article.author
            }
        })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
     });
  }
}