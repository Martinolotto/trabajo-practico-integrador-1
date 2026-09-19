/*
 * GUIA DEL EXAMEN — HELPER DE BCRYPT
 * Helper = funcion reutilizable; importarla donde haga falta.
 * Problema: guardar una contrasena en texto plano expone credenciales.
 * REGISTRO: password -> hashPassword -> hash -> guardar hash en MySQL.
 * LOGIN: password recibida + hash en MySQL -> comparePassword -> true/false.
 * IMPORTANTE: hash != cifrado reversible; no se puede "deshashear".
 * bcrypt incluye salt aleatorio; hashes de la misma clave pueden diferir.
 * rounds=10: parametro de costo de calculo, no longitud de contrasena.
 */

import bcrypt from "bcrypt";

// Convierte la contraseña original en un hash.
// El 10 es el factor de costo de bcrypt.
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compara la contraseña escrita con el hash guardado.
// Devuelve true o false.
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

//bcrypt aplica una función de hash unidireccional con salt. No cifra una contraseña para descifrarla después.