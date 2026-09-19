/*
 * GUIA DEL EXAMEN — HELPER JWT (jsonwebtoken)
 * JWT = token firmado, normalmente header.payload.signature.
 * No es una sesion guardada automaticamente en MySQL.
 * jwt.sign({id}, JWT_SECRET, {expiresIn:"1h"}) genera un token.
 * jwt.verify(token, JWT_SECRET) verifica FIRMA y EXPIRACION o lanza error.
 * El payload se puede leer: NO guardar passwords ni secretos alli.
 * JWT_SECRET va en .env (ignorado por Git). Sin secreto falla generacion.
 * La cookie es el transporte del JWT, no el JWT en si.
 */

import jwt from "jsonwebtoken";

//Obtener nuestra clave privada de las variables de entorno.
const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Falta configurar JWT_SECRET");
  }

  return process.env.JWT_SECRET;
};

//Generar token firmado con el ID del usuario.
//expiresIn hace que deje de ser válido después de una hora.
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, //payload: datos que identifican al usuario
    getSecret(), //firma: clave privada del servidor
    { expiresIn: "1h" },
  );
};

//Verificar firma y vencimiento.
//Si el token es inválido o expiró, jwt.verify lanza un error.
export const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};

//JWT es un token firmado, su payload no está cifrado y la firma permite verificar que no se haya modificado. No guardamos contraseñas ni datos secretos dentro del token.