//importar router
import { Router } from "express";

import { createProfile } from "../controllers/profile.controller.js";

//enrutador agrupa las rutas de profile
export const profileRouter = Router()

//rutas
// profileRouter.get("/profile", getAllProfiles)
profileRouter.post("/profiles", createProfile)
// profileRouter.get("/profile/:id", getProfileById)
// profileRouter.put("/profile/:id", updateProfile)
// profileRouter.delete("/profile/:id", deleteProfile);