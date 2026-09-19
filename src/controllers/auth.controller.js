/*
 * GUIA DEL EXAMEN — CONTROLADOR DE AUTENTICACION
 * FUNCION: ejecutar la logica de registro, inicio y cierre de sesion y perfil.
 * NO define URLs (eso es auth.routes.js) ni valida formatos (auth.validation.js).
 * Se ejecuta DESPUES de las validaciones y de validate.
 *
 * REGISTER, PUBLICO:
 * 1) matchedData obtiene username, email, password, nombre y apellido validados.
 * 2) hashPassword transforma la contrasena a un hash bcrypt (nunca texto plano).
 * 3) sequelize.transaction abre una transaccion: crea User Y su Profile.
 * 4) Si todo termina bien: COMMIT automatico, HTTP 201 sin mostrar password.
 * 5) Si algo falla: ROLLBACK automatico; unique -> 400, otros errores -> 500.
 *    El rol SIEMPRE se fija como user. No aceptar un admin elegido por el cliente.
 *
 * LOGIN, PUBLICO:
 * 1) Recuperar email y password validados con matchedData.
 * 2) Buscar usuario en MySQL por email; con User paranoid no ve borrados.
 * 3) bcrypt.compare(comprueba original vs hash; NO descifra el hash).
 * 4) Si coincide: jwt.sign crea token firmado con ID y vencimiento.
 * 5) res.cookie envia token como cookie HttpOnly; HTTP 200.
 * 6) Si falla email o contrasena -> 401 sin revelar cual falló.
 *
 * GET/PUT PROFILE, PRIVADOS:
 * 1) authMiddleware ya verifico token y cargo req.user desde MySQL.
 * 2) Buscar Profile asociado a req.user.id; nunca confiar en un user_id del body.
 * 3) GET devuelve perfil; PUT toma solo campos validados y los actualiza.
 *
 * LOGOUT: res.clearCookie pide al navegador quitar cookie; no revoca
 * automaticamente un JWT copiado, que puede seguir valido hasta vencer.
 */

import { matchedData } from "express-validator";
import { sequelize } from "../config/database.js";
import { UserModel } from "../models/user.model.js";
import { ProfileModel } from "../models/profile.model.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

//Configuración de la cookie que transporta el JWT.
//httpOnly impide leerla desde JavaScript del navegador.
// HttpOnly protege frente a lectura directa desde JS; no evita por si solo CSRF.
// sameSite:lax limita algunos envios entre sitios; secure usa HTTPS en produccion.
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

//REGISTRO - POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name } = matchedData(
      req,
      { locations: ["body"] },
    );

    //Nunca guardar la contraseña original.
    const passwordHash = await hashPassword(password);

    //Crear User y Profile en una sola transacción.
    //Si falla una creación, se revierten ambas.
    // sequelize proporciona el objeto transaction al callback async.
    // Todas las consultas dentro deben recibir {transaction}.
    // Si devuelve OK -> COMMIT; si arroja error -> ROLLBACK.
    const user = await sequelize.transaction(async (transaction) => {
      const newUser = await UserModel.create(
        {
          username,
          email,
          password: passwordHash,
          role: "user", //registro público nunca asigna admin
        },
        { transaction },
      );

      await ProfileModel.create(
        {
          user_id: newUser.id,
          first_name,
          last_name,
        },
        { transaction },
      );

      return newUser;
    });

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Username o email ya registrado",
      });
    }

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//LOGIN - POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = matchedData(req, {
      locations: ["body"],
    });

    //Buscar usuario por email.
    const user = await UserModel.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    //Comparar contraseña ingresada contra hash guardado.
    // user.password es el hash que guardamos al registrarlo.
    // La contraseña enviada no se compara con ===; bcrypt verifica el hash.
    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    //Crear JWT firmado con el ID del usuario.
    // El ID en JWT sirve de referencia, pero el rol real se lee luego en BD.
    const token = generateToken(user.id);

    //Enviar JWT como cookie al cliente.
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000, //1 hora en milisegundos
    });

    return res.status(200).json({
      message: "Inicio de sesión correcto",
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//PERFIL - GET /api/auth/profile
export const getAuthProfile = async (req, res) => {
  try {
    //req.user fue agregado por authMiddleware.
    const profile = await ProfileModel.findOne({
      where: { user_id: req.user.id },
    });

    return res.status(200).json({
      user: req.user,
      profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//ACTUALIZAR PERFIL - PUT /api/auth/profile
export const updateAuthProfile = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No enviaste campos para actualizar",
      });
    }

    //Solo buscamos el perfil del usuario autenticado.
    const profile = await ProfileModel.findOne({
      where: { user_id: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Perfil no encontrado",
      });
    }

    await profile.update(data);

    return res.status(200).json({
      message: "Perfil actualizado correctamente",
      profile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
};

//LOGOUT - POST /api/auth/logout
export const logout = (req, res) => {
  //Eliminar la cookie del navegador.
  // El navegador debe enviar esta cookie en peticiones privadas posteriores.
  // Logout la quita usando las mismas opciones principales de cookie.
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    message: "Sesión cerrada correctamente",
  });
};
