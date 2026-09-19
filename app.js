/*
 * GUIA DEL EXAMEN — app.js, PUNTO DE ENTRADA DEL BACKEND
 * ORDEN DE CONSTRUCCION:
 * 1) import "dotenv/config" (leer .env) y paquetes de Node/Express.
 * 2) Importar DB, asociaciones Sequelize y routers.
 * 3) const app = express(); (ANTES de cualquier app.use).
 * 4) Middlewares globales: cors, express.json, cookieParser.
 * 5) app.use('/api', router): montar recursos y auth.
 * 6) startServer: await startDB() -> authenticate/sync -> app.listen(PORT).
 *
 * cors({origin, credentials:true}) habilita ese frontend al acceso
 * desde el navegador con credenciales; NO autentica ni asigna permisos.
 * express.json() convierte cuerpo JSON de request en req.body.
 * cookieParser() interpreta Cookie y crea req.cookies.token.
 * Para cookie en fetch del frontend tambien se usa credentials:'include'.
 * Los middlewares de auth/admin/owner van en las RUTAS privadas.
 */

import "dotenv/config"; //Cargar variables .env antes de ejecutar la configuracion
// aplicacion con expresss y configuracion
import express from "express";
// conexion a la DB
import { startDB } from "./src/config/database.js";
//cors
import cors from "cors";
//para leer cookies
import cookieParser from "cookie-parser";

//importamos los modelos y sus relaciones para que se ejecute y lleve a cabo las relaciones
import "./src/models/associations.js";

//routers
import { userRouter } from "./src/routes/user.routes.js";
import { profileRouter } from './src/routes/profile.routes.js';
import { articleRouter } from './src/routes/article.routes.js';
import { tagRouter } from "./src/routes/tag.routes.js";
import { articleTagRouter } from "./src/routes/article.tag.routes.js";
//nuevo router para auth
import { authRouter } from "./src/routes/auth.routes.js";

//aplicacion y puerto
const app = express();
const puerto = process.env.PORT || 3005;

//CORS: permite a nuestro frontend acceder a la API con cookies.
//credentials true NO reemplaza la autenticacion; solo permite credenciales en CORS.
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

//Parsea el JSON del cuerpo de la request -> req.body.
app.use(express.json());

//Parsea el encabezado Cookie -> req.cookies (necesario en authMiddleware).
app.use(cookieParser());

// Middleware express.json ya configurado arriba; no duplicarlo.


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
app.use("/api", tagRouter)
app.use("/api", articleTagRouter)
//nuevo router montado
app.use("/api", authRouter);

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
