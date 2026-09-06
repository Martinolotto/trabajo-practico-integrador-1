//importar router
import { Router } from "express";

//enrutador agrupa las rutas de user
export const userRouter = Router()

//ruta temporal de prueba
userRouter.get("/users", (req,res)=>{
    return res.status(200).json({
        message: "Listado de usuarios"
    })
})