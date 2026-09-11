// aplicacion con expresss y configuracion
import express from "express";
// conexion a la DB
import { startDB } from "./src/config/database.js";

//importamos los modelos y sus relaciones para que se ejecute y lleve a cabo las relaciones
import "./src/models/associations.js";

//routers
import { userRouter } from "./src/routes/user.routes.js";
import { profileRouter } from './src/routes/profile.routes.js';
import { articleRouter } from './src/routes/article.routes.js';

//aplicacion y puerto
const app = express();
const puerto = process.env.PORT || 3005;

// permite leer cuerpos JSON enviados por el cliente
app.use(express.json());


//ruta de prueba del servidor
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "servidor prendido",
  });
});

//configuracion de las rutas de user bajo prefijo /api
app.use("/api", userRouter);
app.use("/api", profileRouter);
app.use("/api", articleRouter)

//incia la base de datos y si funciona incia el server
const startServer = async () => {
  try {
    // esperamos que se resuelva la conexion
    await startDB();
    //servidor escuchando peticiones en el puerto
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  } catch (error) {
    console.error("No se puedo inciar el servidor");
  }
};
startServer();
