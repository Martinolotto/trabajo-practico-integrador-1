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
UserModel.hasMany(ArticleModel, {
  foreignKey: "user_id",
  as: "articles",
});

ArticleModel.belongsTo(UserModel, {
  foreignKey: "user_id",
  as: "author",
});


//N:M
ArticleModel.belongsToMany(TagModel, {
  //tabla puente
  through: ArticleTagModel,
  foreignKey: "article_id",
  //fk de la tabla puente
  otherKey: "tag_id",
  as: "tags"

})

TagModel.belongsToMany(ArticleModel, {
  through: ArticleTagModel,
  foreignKey: "tag_id",
  otherKey: "article_id",
  as: "articles"
})

