//¿Qué función debe ejecutarse para esta combinación de método HTTP + URL?
//importar router
import { Router } from "express";

import { getUsers } from "../controllers/user.controller.js";

//enrutador agrupa las rutas de user
export const userRouter = Router()

//rutas. 
userRouter.get("/users", getUsers)