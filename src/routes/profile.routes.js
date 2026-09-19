//importar router
import { Router } from "express";

import { createProfile } from "../controllers/profile.controller.js";

import { createProfileValidations } from "../middlewares/profile.validation.js";
import { validate } from "../middlewares/validate.js";

//enrutador agrupa las rutas de profile
export const profileRouter = Router();

//rutas
// profileRouter.get("/profile", getAllProfiles)
profileRouter.post(
  "/profiles",
  createProfileValidations,
  validate,
  createProfile,
);
// profileRouter.get("/profile/:id", getProfileById)
// profileRouter.put("/profile/:id", updateProfile)
// profileRouter.delete("/profile/:id", deleteProfile);
