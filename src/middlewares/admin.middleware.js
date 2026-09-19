/*
 * GUIA DEL EXAMEN — AUTORIZACION POR ROL ADMIN
 * COLOCAR SIEMPRE DESPUES DE authMiddleware.
 * authMiddleware identifico al usuario y creo req.user consultando MySQL.
 * adminMiddleware pregunta: ¿tiene permiso de administrador?
 * SI -> next(): sigue validacion o controlador.
 * NO -> 403: usuario autenticado pero SIN autorizacion para esta accion.
 * El usuario NO puede darse permiso admin desde el body o un JWT inventado.
 * IMPORTANTE: el router debe APLICAR este middleware; crearlo no alcanza.
 */

//Este middleware se ejecuta DESPUÉS de authMiddleware.
//req.user contiene al usuario autenticado.
export const adminMiddleware = (req, res, next) => {
  // req.user se creó en authMiddleware al validar el JWT.
  // Si role no es admin, se corta la request con 403.
  if (req.user.role !== "admin") {
    //403: sabemos quién es, pero no tiene permiso
    return res.status(403).json({
      message: "Acceso permitido solo a administradores",
    });
  }

  next();
};
//solo verificamos si es admin para darle los permisos 

// 401 no autenticado, 403 autenticado pero sin permisos