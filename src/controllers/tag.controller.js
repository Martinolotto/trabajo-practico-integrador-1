//modelo donde hacemos las consultas
import { ArticleModel } from "../models/article.model.js";
import { TagModel } from "../models/tag.model.js";

//crear tag Y desde Article quiero llamar a los relacionados tags
export const createTag = async (req, res) => {
  try {
    //obtener los datos del body
    const { name } = req.body;

    //crear un articulo
    const tag = await TagModel.create({
        name
    });

    //response ok
    return res.status(201).json({
      message: "etiqueta creada correctamente",
        tag: {
        id: tag.id,
        name: tag.name
      },
    });
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
    const TagId = req.params.id

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
        message: "tag no encontrado"
      })
    }


    return res.status(200).json({
      message: "Tag encontrado",
      tag: {
        id: tag.id,
        name: tag.name,
        articles: tag.articles
      }
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
}