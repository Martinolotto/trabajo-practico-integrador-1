//relaciones entre las entidades para sequelize
import { UserModel } from "./user.model.js";
import { ProfileModel } from "./profile.model.js";

//las relaciones de ambos lados

//user tiene un profile
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
