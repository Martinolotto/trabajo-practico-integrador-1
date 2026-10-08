/*
 * GUIA DEL EXAMEN — AUTENTICACION EN PETICIONES PRIVADAS
 * Se ejecuta DESPUES de cookieParser() en app.js y ANTES del controlador.
 * PASOS:
 * 1) Obtener req.cookies.token (cookie HttpOnly enviada por cliente).
 * 2) Si falta -> HTTP 401; NO ejecutar controlador.
 * 3) verifyToken() comprueba firma y vencimiento del JWT.
 * 4) Si falla la verificacion -> HTTP 401.
 * 5) Leer decoded.id del payload y buscar al usuario en MySQL.
 * 6) Si no existe o fue borrado con paranoid -> HTTP 401.
 * 7) req.user = usuario real (incluye role); next() permite continuar.
 * 8) Un error inesperado de MySQL -> HTTP 500.
 * SOLO responde ¿QUIEN ES?; permisos concretos se ven en admin/owner.
 * NO confiar ciegamente en req.body.user_id ni en un rol enviado por cliente.
 */

//Primera capa de proteccion: identificar al usuario antes de autorizarlo.

import { verifyToken } from "../helpers/jwt.helper.js";
import { UserModel } from "../models/user.model.js";

//Comprueba quién hace la petición.
//El cliente debe enviar una cookie llamada token.
export const authMiddleware = async (req, res, next) => {
  // El ?. permite acceder sin romper cuando no existe req.cookies.
  // Si cookieParser no fue registrado en app.js, no podremos leer cookies.
  const token = req.cookies?.token;

  //401: no sabemos quién es el usuario
  if (!token) {
    return res.status(401).json({
      message: "No estás autenticado",
    });
  }

  let decoded;

  try {
    //Comprobar firma y vencimiento del JWT
    // decoded devuelve el payload verificado, por ejemplo: {id: 7, iat, exp}.
    decoded = verifyToken(token);
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido o vencido",
    });
  }

  try {
    //Buscar el usuario real para verificar que siga existiendo
    //y no haya sido eliminado lógicamente.
    const user = await UserModel.findByPk(decoded.id, {
      attributes: ["id", "username", "email", "role"],
    });

    if (!user) {
      return res.status(401).json({
        message: "La sesión ya no es válida",
      });
    }

    //Adjuntamos el usuario a la request.
    //Los siguientes middlewares y controladores pueden usarlo.
    // Seguridad: el rol proviene del usuario consultado en DB, no del body.
    req.user = user;
//pasa al siguiente middleware
    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

// Login con email y contraseña
// |
// >
// bcrypt.compare()
// generateToken(user.id)
// Cookie token, HttpOnly
// Siguiente request: authMiddleware
// verifyToken() → buscar usuario → req.user


// req.user no viene directamente del cliente. Lo agregamos nosotros después de verificar el JWT y buscar al usuario