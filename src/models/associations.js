//relaciones entre las entidades para sequelize
import { UserModel } from "./user.model.js";
import { ProfileModel } from "./profile.model.js";
import { ArticleModel } from "./article.model.js";
import { TagModel } from "./tag.model.js";
import { ArticleTagModel } from "./article.tag.model.js";

//1:1
//user tiene un profile
//las relaciones de ambos lados
UserModel.hasOne(ProfileModel, {
  foreignKey: "user_id",
  //si estoy parado en user
  //llamo a la entidad relacionada como el alias
  //queremos user.profile
  as: "profile",
});

//profile pertenece a un user
ProfileModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  //si estoy parado en profile
  //llamo a la entidad relacionada como el alias
  //queremos profile.user
  as: "user",
});

//1:N
// un usuario se ouede relacionar con muchos articulos
UserModel.hasMany(ArticleModel, {
  foreignKey: "user_id",
  as: "articles",
});
//a cada articulo le corresponde un usuario
ArticleModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "author",
});


//N:M
//Un Article se puede relacionar con muchos Tags
ArticleModel.belongsToMany(TagModel, {
  //tabla puente
  // Esa relación no está directamente en Article, sino que pasa a través de ArticleTagModel
  through: ArticleTagModel,
  //Cuando estoy parado en Article, la columna de la tabla puente que me representa es article_id
  foreignKey: "article_id",
  // La columna que representa al otro lado es tag_id
  //fk de la tabla puente
  otherKey: "tag_id",
  //Y desde Article quiero llamar a los relacionados tags
  as: "tags"

})

TagModel.belongsToMany(ArticleModel, {
  through: ArticleTagModel,
  foreignKey: "tag_id",
  otherKey: "article_id",
  as: "articles"
})
