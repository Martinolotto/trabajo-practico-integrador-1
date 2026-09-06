// aplicacion con expresss y configuracion
import express from "express"

//enrutadores
import { userRouter } from "./src/routes/user.routes.js"

//aplicacion y puerto
const app = express()
const puerto = 3000

//ruta de prueba del servidor
app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "servidor prendido"
    })
})

//conecta las rutas de user bajo prefijo /api
app.use("/api", userRouter)

// servidor escuchando peticiones en el puerto
app.listen(puerto, ()=>{
    console.log(`Servidor corriendo en el puerto ${puerto} `)
} )