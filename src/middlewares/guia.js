// ================================================================================
// MAPA COMPLETO DEL EXAMEN - API REST CON NODE.JS, EXPRESS, SEQUELIZE Y MYSQL
// GUIA DE CONSTRUCCION Y REPASO BASADA EN EL TRABAJO PRACTICO INTEGRADOR I
// ================================================================================
//
// IMPORTANTE:
// Este archivo tiene UNICAMENTE comentarios de JavaScript.
// Podes dejarlo con extension .md o cambiarle el nombre a GUIA_EXAMEN_TP1.js.
// No ejecuta codigo, no modifica la API y no contiene claves ni contraseñas.
// NO TENES QUE HACER TODO LO DE ESTA GUIA SI EL PARCIAL PIDE MENOS.
// Siempre manda la consigna concreta del examen.
//
// ================================================================================
// 00 - PRIMEROS 3 MINUTOS DEL EXAMEN: LEER LA CONSIGNA
// ================================================================================
//
// PASO 00.1: Identificar el objetivo del sistema. Que problema resuelve la API?
// PASO 00.2: Subrayar las ENTIDADES. Cada entidad suele convertirse en un modelo.
// PASO 00.3: Por cada entidad, anotar atributos, tipo, PK, FK, allowNull y unique.
// PASO 00.4: Identificar relaciones: uno a uno, uno a muchos y muchos a muchos.
// PASO 00.5: Encontrar las reglas especiales: cascada, borrado logico, timestamps.
// PASO 00.6: Anotar cada endpoint como METODO + URL + QUIEN PUEDE USARLO.
// PASO 00.7: Separar endpoints PUBLICOS de endpoints que requieren LOGIN.
// PASO 00.8: En los endpoints privados distinguir USER, ADMIN y PROPIETARIO.
// PASO 00.9: Marcar las validaciones: campos obligatorios, rangos, unicidad,
//            formato de email, regex, existencia de FK, IDs enteros, etc.
// PASO 00.10: Anotar el HTTP STATUS esperado: 200, 201, 400, 401, 403, 404, 500.
// PASO 00.11: Revisar expresamente tecnologias exigidas y estructura de carpetas.
// PASO 00.12: Si piden Git, anotar ramas, cantidad minima de commits y merges.
// PASO 00.13: Armar una lista ordenada de implementacion. No programar al azar.
//
// PREGUNTAS QUE DEBES RESPONDER AL LEER CUALQUIER ENDPOINT:
// Que metodo HTTP usa? GET, POST, PUT o DELETE?
// Que ruta necesita? Tiene :id por params o datos en body?
// Puede usarlo cualquiera, un usuario autenticado, un admin o el autor?
// Que debo validar antes de entrar al controlador?
// Que modelo o asociacion de Sequelize necesita?
// Cual debe ser el resultado y el status HTTP?
// Que pasa si el dato es invalido, no existe o no tiene permiso?
//
// NO CONFUNDIR REQUISITOS:
// En el TP1 original se mencionan CRUD completos, pero la lista de endpoints
// detalla cuales son los obligatorios. Lee AMBAS secciones de la consigna.
// Si un examen tiene otra lista, segui exactamente sus endpoints y permisos.
//
// ================================================================================
// 01 - ORDEN DE CONSTRUCCION SI EMPEZAS UN PROYECTO DESDE CERO
// ================================================================================
//
// PASO 01: Crear repositorio y estructura. npm init -y.
// PASO 02: package.json: configurar type = module y script dev.
// PASO 03: Instalar SOLO las dependencias necesarias segun el examen.
//          Para TP1: express, sequelize, mysql2, cors, dotenv,
//          express-validator, bcrypt, jsonwebtoken, cookie-parser.
// PASO 04: Crear .gitignore para node_modules/ y .env.
// PASO 05: Crear .env LOCAL con DB_HOST, DB_USER, DB_PASSWORD, DB_NAME,
//          PORT y JWT_SECRET cuando se implemente JWT.
// PASO 06: Crear .env.example con nombres de variables y valores FICTICIOS.
//          Nunca subir credenciales, tokens reales o claves secretas.
// PASO 07: Crear src/config/database.js, exportar instancia sequelize.
// PASO 08: Crear modelos src/models/*.model.js desde atributos de la consigna.
// PASO 09: Crear src/models/associations.js e importarlo desde app.js.
// PASO 10: Crear app.js: Express, middlewares globales, routers y startServer.
// PASO 11: Crear validaciones del recurso y middleware general validate.
// PASO 12: Crear controladores CRUD con try/catch y Sequelize.
// PASO 13: Crear routers que conecten METHOD + URL + VALIDACION + CONTROLLER.
// PASO 14: Probar al menos una ruta completa: POST, GET, PUT, DELETE.
// PASO 15: Agregar eliminacion logica, cascadas y transacciones SI SE EXIGEN.
// PASO 16: Agregar helper bcrypt y hashear TODAS las contraseñas nuevas/cambiadas.
// PASO 17: Agregar helper JWT, cookie-parser y controlador de auth.
// PASO 18: Crear authMiddleware; despues adminMiddleware y ownerMiddleware.
// PASO 19: Poner middlewares de permiso en TODAS las rutas que corresponda.
// PASO 20: Probar errores, hacer commits y seguir el flujo Git exigido.
//
// ATAJO DE EXAMEN: si la consigna pide un recurso pequeño, hacelo completo
// de punta a punta antes de agregar mas entidades. Proba temprano.
//
// ================================================================================
// 02 - QUE ES CADA CARPETA Y QUE RESPONSABILIDAD TIENE
// ================================================================================
//
// app.js                        Punto de entrada, configura Express y monta routers.
// src/config/database.js        Conexion y sincronizacion de modelos con MySQL.
// src/models/                  Describe las tablas con Sequelize.
// src/models/associations.js    Describe relaciones, FK y alias entre modelos.
// src/routes/                  Elige el controlador para metodo + URL.
// src/middlewares/*.validation  Reglas para los datos de entrada.
// src/middlewares/validate.js   Lee los errores de express-validator.
// src/middlewares/auth.*        Averigua quien hace la request.
// src/middlewares/admin.*       Comprueba permiso de administrador.
// src/middlewares/owner.*       Comprueba quien es autor/propietario.
// src/controllers/             Implementa la logica y responde HTTP.
// src/helpers/                 Funciones reutilizables: bcrypt y JWT.
// .env                         Variables REALES privadas, no se sube.
// .env.example                 Plantilla publica SIN secretos.
// package.json                 Dependencias, scripts y ESModules.
//
// UN HELPER NO ES UN MIDDLEWARE:
// Helper = funcion reutilizable invocada por un controlador o middleware.
// Middleware = funcion (req, res, next) que decide si pasa la request.
// Controller = funcion que ejecuta el caso de uso y responde al cliente.
// Modelo = definicion de datos; no maneja peticiones HTTP.
//
// ================================================================================
// 03 - MAPA GENERAL DE ARRANQUE DE LA APLICACION
// ================================================================================
//
// npm run dev -> ejecuta el script configurado en package.json.
// Node carga imports -> dotenv -> database.js -> modelos -> asociaciones -> rutas.
// dotenv/config permite leer variables de .env desde process.env.
// process.env pertenece al proceso Node, no a un archivo aislado.
// Se crea app = express(). NO usar app.use ANTES de const app = express().
// Se configuran app.use(cors(...)), app.use(express.json()), cookieParser().
// Se importan y registran routers con app.use('/api', router).
// startServer() espera startDB(): sequelize.authenticate() y sequelize.sync().
// Si conecta correctamente -> app.listen(PORT) empieza a escuchar requests.
// IMPORTANTE: sequelize.sync() normal NO es una migracion confiable
// de columnas de tablas existentes. No usar sync({force:true}) con datos.
//
// express.json() lee JSON enviado en el body y deja los datos en req.body.
// cookieParser() lee el header Cookie y deja valores en req.cookies.
// cors() establece reglas de origen del navegador; NO autentica usuarios.
// credentials:true permite respuestas con credenciales para origen autorizado.
// Si hay frontend separado, el cliente debe enviar credenciales al llamar API.
// Puerto: process.env.PORT || 3005 significa puerto del entorno o 3005.
//
// ================================================================================
// 04 - MAPA DE UNA REQUEST SIN AUTENTICACION
// ================================================================================
//
// EJEMPLO: POST /api/tags con body que contiene el nombre de una etiqueta.
// 1. El cliente manda metodo, URL, headers y JSON.
// 2. Express recibe la peticion y express.json() construye req.body.
// 3. app.use('/api', tagRouter) encuentra el router.
// 4. tagRouter.post('/tags', createTagValidations, validate, createTag).
// 5. createTagValidations verifica requisitos del body.
// 6. Si usa .custom(), puede consultar MySQL para comprobar unicidad.
// 7. validate ejecuta validationResult(req) para reunir errores.
// 8. Si hay errores -> responder 400; NO llamar next ni controller.
// 9. Si no hay errores -> next() para continuar al controller.
// 10. createTag extrae datos con matchedData(req,{locations:['body']}).
// 11. TagModel.create(...) genera una operacion SQL con Sequelize.
// 12. MySQL guarda registro y devuelve resultado a Sequelize.
// 13. El controlador responde HTTP 201 + JSON al cliente.
//
// MAPA PARA MEMORIZAR:
// Request -> app -> router -> validator -> validate -> controller
//         -> modelo Sequelize -> MySQL -> respuesta JSON + status.
//
// req.params = valores de URL como /users/:id.
// req.body = JSON que envia cliente.
// req.query = parametros de consulta como ?page=2.
// matchedData(req) = campos que fueron validados por express-validator.
// matchedData(req,{locations:['body']}) = solo campos validados del body.
//
// ================================================================================
// 05 - SEQUELIZE: MODELOS Y RELACIONES
// ================================================================================
//
// Modelo: importar DataTypes y la instancia sequelize desde database.js.
// Crear sequelize.define('Nombre', { atributos }, { opciones }).
// Atributos: id INT PRIMARY KEY autoIncrement; campos VARCHAR, TEXT, DATE.
// Reglas: allowNull:false si obligatorio; unique:true si no se repite.
// FK: columna user_id, article_id, tag_id, etc. referencia PK de otra tabla.
// Opciones de timestamps: createdAt:'created_at', updatedAt:'updated_at'.
// Los nombres exactos de columnas dependen de la consigna.
//
// RELACION 1:1: User.hasOne(Profile) y Profile.belongsTo(User).
// Cada usuario tiene como mucho un perfil; Profile.user_id suele ser UNIQUE.
// RELACION 1:N: User.hasMany(Article) y Article.belongsTo(User).
// Un usuario puede tener muchos articulos; cada articulo pertenece a uno.
// RELACION N:M: Article.belongsToMany(Tag) y Tag.belongsToMany(Article).
// Se utiliza through: ArticleTagModel como tabla intermedia.
// foreignKey = FK del modelo actual en tabla intermedia.
// otherKey = FK del modelo del otro lado de la relacion.
// as = alias con el que se consulta la relacion desde ese modelo.
// Ejemplo conceptual: User.hasOne(Profile,{as:'profile'}).
// Luego include: {model:ProfileModel, as:'profile'} permite traer perfil.
// El alias del include debe coincidir con el definido en associations.js.
//
// Un include realiza consulta de datos asociados.
// attributes:{exclude:['password']} evita enviar hashes en la respuesta.
// Aun mejor: seleccionar expresamente atributos no sensibles.
//
// ================================================================================
// 06 - EXPRESS VALIDATOR: PATRON DE VALIDACION
// ================================================================================
//
// A. Importar body y param desde express-validator.
// B. Definir array de validaciones por endpoint: create, getById, update, delete.
// C. body('email').isEmail() valida el cuerpo de la peticion.
// D. param('id').isInt({min:1}) valida identificador de la URL.
// E. notEmpty(), isLength(), matches(), isIn() implementan reglas.
// F. optional() en PUT: campo puede OMITIRSE, pero si llega se valida.
// G. custom(async(valor)=>{}) permite consultar existencia o unicidad.
// H. validate.js usa validationResult(req), responde 400 si hay errores.
// I. Controller usa matchedData() para tomar SOLO datos validados.
// J. Con el UPDATE usar locations:['body'] para no actualizar el ID param.
//
// IMPORTANTE: validationResult no borra el req.body original.
// IMPORTANTE: matchedData filtra campos; no sustituye autenticacion.
// IMPORTANTE: IDs inexistentes idealmente responden 404, pero si .custom()
// valida su existencia y lanza un error, tu middleware puede responder 400.
// Si la consigna distingue 400 de 404, diseñar esa diferencia con cuidado.
// IMPORTANTE: validar en aplicacion no reemplaza unique ni FK de MySQL.
//
// ================================================================================
// 07 - CRUD Y PATRON DE LOS CONTROLADORES
// ================================================================================
//
// CREAR: extraer body validado -> comprobar requisitos -> Model.create(data).
// Respuesta habitual: 201 Created y objeto creado sin password.
//
// LISTAR: Model.findAll({include...}) -> 200 OK y lista JSON.
// BUSCAR POR ID: Model.findByPk(id,{include...}) -> 200 o 404.
//
// ACTUALIZAR: ID por req.params.id; data por matchedData(body).
// Verificar si existe, usar .optional() y instance.update(data).
// Responder 200 con datos actualizados.
//
// ELIMINAR: ID por params, buscar instancia, instance.destroy().
// En modelo normal = fisico. En paranoid:true = logico.
// Responder 200 cuando la eliminacion termina bien.
//
// Todos los controladores deben usar try/catch para errores inesperados.
// El error inesperado corresponde a 500; no enviar detalles internos al cliente.
// No ejecutar una actualizacion con todos los campos sin filtrar validaciones.
// Nunca responder con password, hash o JWT secreto.
//
// ================================================================================
// 08 - ELIMINACION LOGICA, CASCADA Y TRANSACCIONES
// ================================================================================
//
// LOGICA: paranoid:true y deletedAt:'deleted_at' en opciones de modelo.
// Al hacer instance.destroy() se marca deleted_at; la fila permanece.
// Con findAll/findByPk normal, Sequelize excluye esos registros.
// Una consulta con paranoid:false puede incluir registros eliminados.
// Una instancia eliminada logicamente puede recuperarse con restore().
// La columna deleted_at DEBE EXISTIR en la tabla real de MySQL.
//
// FISICA: destroy() en modelo sin paranoid elimina fila realmente.
// CASCADA MYSQL: ON DELETE CASCADE elimina filas hijas cuando un padre
// es eliminado FISICAMENTE, si la FK real fue configurada con CASCADE.
// No se limita a N:M; se usa tambien con relaciones 1:1 o 1:N.
// ON UPDATE CASCADE propaga cambio en la CLAVE referenciada (por ej PK),
// NO propaga cambios normales de title, name o email.
// Borrado logico actualiza deleted_at y NO dispara ON DELETE CASCADE.
//
// LIMPIEZA MANUAL: ArticleTagModel.destroy({where:{article_id:id}}).
// Elimina vinculos de la tabla intermedia; NO elimina las etiquetas.
// TRANSACCION: sequelize.transaction(async(transaction)=>{ ... }).
// Todas las operaciones reciben {transaction} y se ejecutan juntas.
// Si terminan bien: COMMIT. Si una falla: ROLLBACK.
// Transaccion y cascada NO son sinonimos. Pueden combinarse.
//
// PARA TP1: User se elimina logicamente.
// PARA TP1: Article se elimina logicamente segun endpoint DELETE Article.
// PARA TP1: al eliminar Article se deben quitar asociaciones ArticleTag.
// PARA TP1: Tag se borra fisicamente; sus asociaciones deben quedar limpias.
// PARA TP1: verificar que existan las cascadas pedidas en las FK reales.
// AÑADIR onDelete:'CASCADE' al modelo no garantiza actualizar la FK existente.
// Revisar SHOW CREATE TABLE ArticleTags o las restricciones en el visor.
//
// ================================================================================
// 09 - AUTENTICACION: COMO IDENTIFICAMOS AL USUARIO
// ================================================================================
//
// AUTENTICAR = RESPONDER: QUIEN ESTA REALIZANDO LA REQUEST?
// Antes, cualquiera podia llamar DELETE /api/users/:id si conocia la URL.
// Ahora protegemos rutas privadas; primero exigimos una identidad valida.
//
// REGISTRO PUBLICO: cliente envia username/email/password y datos perfil.
// 1. auth.routes.js dirige POST /api/auth/register.
// 2. registerValidations valida username, email, password, nombre, apellido.
// 3. validate frena datos invalidos con 400.
// 4. register controller toma campos validados con matchedData.
// 5. hashPassword() genera un hash bcrypt de la contraseña.
// 6. sequelize.transaction crea User y Profile atomicamente.
// 7. role siempre se fija como 'user', NO confiar en el rol del cliente.
// 8. Responder 201 sin mostrar hash de password.
//
// BCRYPT HELPER:
// bcrypt.hash(password,10) crea hash con salt y costo de trabajo.
// bcrypt.compare(password,hash) responde true o false.
// Hash NO es cifrado reversible; NO se descifra la contraseña.
// Los usuarios viejos guardados en texto plano requieren solucion aparte.
// En TODA ruta que cambie password tambien hay que generar nuevo hash.
//
// LOGIN PUBLICO: cliente envia email y password.
// 1. Validar formato y que vengan los campos.
// 2. Buscar User en MySQL por email (con paranoid se ignoran borrados).
// 3. bcrypt.compare(password recibido, user.password guardado).
// 4. Si usuario no existe o contraseña no coincide -> HTTP 401.
// 5. Si coincide -> generateToken(user.id).
// 6. jwt.sign firma el payload con JWT_SECRET y caducidad.
// 7. res.cookie('token',jwt,{httpOnly:true,...}) envia cookie.
// 8. Responder HTTP 200; no devolver password ni secreto JWT.
//
// JWT HELPER:
// jwt.sign({id:user.id}, JWT_SECRET, {expiresIn:'1h'}) crea token firmado.
// jwt.verify(token,JWT_SECRET) comprueba firma y expiracion.
// El payload JWT es legible, NO cifrado: nunca poner secretos ahi.
// JWT_SECRET pertenece a .env, jamas al repositorio publico.
// Un JWT vencido o alterado no debe permitir entrar a ruta privada.
//
// COOKIE:
// Cookie es un dato que el servidor envia en Set-Cookie y navegador guarda.
// En peticiones siguientes el navegador puede reenviar cookie token.
// HttpOnly impide que JS en navegador lea la cookie; no elimina todos riesgos.
// cookie-parser convierte header Cookie a req.cookies.
// secure:true exige HTTPS, especialmente en produccion.
// sameSite ayuda frente a CSRF; verificar requisitos de frontend desplegado.
// Con cookies se debe considerar CSRF; CORS por si solo no lo previene.
// Logout con clearCookie elimina cookie del navegador, no revoca JWT robado.
//
// ================================================================================
// 10 - MIDDLEWARE AUTH: COMO VIAJA LA IDENTIDAD
// ================================================================================
//
// authMiddleware ejecuta DESPUES de router y ANTES del controlador privado.
// PASO 1: leer req.cookies?.token.
// PASO 2: si falta token, responder 401 y no llamar next().
// PASO 3: usar verifyToken(token) y capturar error si vencio o firma invalida.
// PASO 4: leer id del payload verificado.
// PASO 5: UserModel.findByPk(id) para verificar usuario existente/activo.
// PASO 6: asignar req.user = user consultado en MySQL.
// PASO 7: llamar next() para que continue otro middleware/controlador.
// SI LA BASE DE DATOS FALLA: error inesperado, responder 500.
//
// IMPORTANTE: el cliente NO manda req.user; lo construye el servidor.
// IMPORTANTE: el JWT certifica un identificador, NO le concede permisos
// automaticamente. Los permisos se evalúan con rol y propiedad del recurso.
// IMPORTANTE: comprobar rol ACTUAL de MySQL, no confiar en role del body.
//
// ================================================================================
// 11 - AUTORIZACION: QUIEN PUEDE HACER CADA COSA
// ================================================================================
//
// AUTORIZAR = RESPONDER: ESTE USUARIO TIENE PERMISO PARA ESTA ACCION?
// Solo comprobar identidad NO es suficiente: autenticado != administrador.
//
// adminMiddleware:
// Requiere que authMiddleware haya creado req.user.
// Si req.user.role !== 'admin', responder 403 Forbidden.
// Si es admin, llamar next().
//
// ownerMiddleware:
// Verificar la identidad del usuario (req.user.id).
// Buscar el articulo del :id u obtenerlo desde ArticleTag, segun endpoint.
// Comparar article.user_id con req.user.id.
// Para editar/eliminar Article, la consigna permite autor O admin.
// Para agregar/quitar ArticleTag, la consigna dice SOLO AUTOR del articulo.
// El 'dueño' de la operacion ArticleTag es autor de Article, NO dueño del Tag.
// Si recurso no existe: 404; si usuario no tiene permiso: 403.
//
// ELEGIR ORDEN DE MIDDLEWARES POR RUTA:
// Publica: validador -> validate -> controlador.
// Privada solo usuario: auth -> validador -> validate -> controlador.
// Privada admin: auth -> admin -> validador -> validate -> controlador.
// Privada autor: auth -> validar id -> comprobar owner -> controlador.
// Si owner necesita ID valido, validar formato del parametro ANTES de buscarlo.
// Nunca usar datos de propiedad enviados por el cliente para autorizar.
//
// HTTP 401 = no hay identidad valida o token incorrecto/expirado.
// HTTP 403 = usuario autenticado pero sin permiso.
// HTTP 404 = recurso solicitado no existe (segun patron de la consigna).
// HTTP 400 = datos invalidos; no confundir con permisos.
//
// ================================================================================
// 12 - PERMISOS Y ENDPOINTS CONCRETOS DEL PDF DEL TP1
// ================================================================================
//
// PREFIJO GENERAL: /api.
//
// USUARIOS, CRUD EXCLUSIVO ADMIN:
// GET    /api/users               Admin, listar con perfiles.
// GET    /api/users/:id           Admin, ver perfil y articulos del usuario.
// POST   /api/users               Admin, crear User y Profile.
// PUT    /api/users/:id           Admin, editar usuario.
// DELETE /api/users/:id           Admin, eliminacion logica de usuario.
//
// ETIQUETAS:
// POST   /api/tags                Admin, crear tag.
// GET    /api/tags                Autenticado, listar tags.
// GET    /api/tags/:id            Admin, ver tag con articulos.
// PUT    /api/tags/:id            Admin, actualizar tag.
// DELETE /api/tags/:id            Admin, eliminar tag.
//
// ARTICULOS:
// POST   /api/articles            Autenticado, crear articulo.
// GET    /api/articles            Autenticado, listar publicados.
// GET    /api/articles/:id        Autenticado, consultar articulo por ID.
// GET    /api/articles/user       Autenticado, sus articulos publicados.
// GET    /api/articles/user/:id   Autenticado, uno de sus articulos por ID.
// PUT    /api/articles/:id        Solo autor O admin.
// DELETE /api/articles/:id        Solo autor O admin, borrado logico.
//
// IMPORTANTE: rutas estaticas /articles/user y /articles/user/:id deben
// registrarse ANTES de la ruta dinamica /articles/:id.
// Al crear articulo, asociar user_id al usuario autenticado; no aceptar
// arbitrariamente el user_id del cliente como prueba de propiedad.
//
// ETIQUETAS EN ARTICULOS:
// POST   /api/articles-tags               Solo autor del articulo.
// DELETE /api/articles-tags/:articleTagId Solo autor del articulo.
// No confundir el ID de relacion ArticleTag con el ID de Article.
//
// AUTENTICACION:
// POST   /api/auth/register        Publico, crea User y Profile.
// POST   /api/auth/login           Publico, devuelve cookie con JWT.
// GET    /api/auth/profile         Autenticado, consulta su perfil.
// PUT    /api/auth/profile         Autenticado, actualiza su perfil.
// POST   /api/auth/logout          Autenticado, limpia cookie.
//
// TODOS LOS ENDPOINTS DEBEN SEGUIR VALIDACIONES Y CODIGOS SOLICITADOS.
// NO se agrega permiso de borrar su propia cuenta mediante /users/:id si
// la consigna dice que Users es exclusivo de admin.
//
// ================================================================================
// 13 - MODELOS Y VALIDACIONES ESPECIFICAS DEL TP1 ORIGINAL
// ================================================================================
//
// USER: id PK; username VARCHAR(20) unico; email VARCHAR(100) unico;
// password VARCHAR(255) hasheada; role ENUM(user,admin) default user;
// created_at, updated_at, deleted_at.
// username: 3 a 20, alfanumerico, unico.
// email: formato valido y unico.
// password: minimo 8, mayuscula, minuscula y numero.
// role: solamente user/admin, pero registro publico fija user.
//
// PROFILE: id PK; user_id FK unico; first_name y last_name VARCHAR(50);
// biography TEXT opcional; avatar_url VARCHAR(255) opcional;
// birth_date DATE opcional; timestamps.
// nombres: 2 a 50, letras; biography maximo 500; avatar URL si llega.
//
// ARTICLE: id PK; title VARCHAR(200); content TEXT; excerpt VARCHAR(500);
// status ENUM(published,archived), por defecto published; user_id FK;
// created_at, updated_at; eliminacion logica en endpoint DELETE.
// title 3-200; content minimo 50; excerpt maximo 500;
// status published o archived; author debe existir y coincidir con req.user,
// con excepcion admin cuando la consigna lo permita.
//
// TAG: id PK; name VARCHAR(30) unico; timestamps.
// name 2 a 30, obligatorio, sin espacios, unico.
//
// ARTICLE_TAG: id PK; article_id FK; tag_id FK; timestamps.
// Verificar existencia de article y tag antes de asociarlos.
// Conservar integridad referencial al eliminar Article y Tag.
//
// Los alias del TP1: User.profile; Profile.user; User.articles;
// Article.author; Article.tags; Tag.articles.
//
// ================================================================================
// 14 - CHECKLIST DE ARCHIVOS NUEVOS DE AUTH Y QUE HACE CADA UNO
// ================================================================================
//
// bcrypt.helper.js:
// 1. importar bcrypt. 2. definir hashPassword.
// 3. definir comparePassword. 4. exportar funciones reutilizables.
//
// jwt.helper.js:
// 1. importar jsonwebtoken. 2. leer JWT_SECRET desde process.env.
// 3. definir generateToken(id). 4. definir verifyToken(token).
//
// auth.validation.js:
// 1. importar body. 2. validar register + Profile.
// 3. validar login (email y password).
// 4. validar campos opcionales de actualizacion de perfil.
//
// auth.controller.js:
// 1. importar modelos, helpers, matchedData, sequelize.
// 2. register: datos validados -> bcrypt -> User + Profile en transaction.
// 3. login: buscar email -> compare -> generateToken -> res.cookie.
// 4. getProfile: usar req.user, buscar perfil en MySQL.
// 5. updateProfile: matchedData(body), perfil de req.user.id, update.
// 6. logout: res.clearCookie('token', mismas opciones de cookie).
// 7. cada controlador con try/catch y codigo HTTP apropiado.
//
// auth.middleware.js:
// 1. leer cookie token. 2. jwt.verify.
// 3. buscar usuario activo. 4. req.user = user. 5. next().
//
// admin.middleware.js:
// 1. revisar req.user.role. 2. 403 si no admin. 3. next si admin.
//
// owner.middleware.js:
// 1. buscar articulo correspondiente. 2. comparar article.user_id.
// 3. aplicar regla autor solo o autor/admin segun ENDPOINT.
// 4. no confundir autor de Article con creador de Tag.
//
// auth.routes.js:
// 1. importar Router, auth controllers, validaciones y middlewares.
// 2. register y login PUBLICOS.
// 3. GET/PUT profile y logout PRIVADOS con authMiddleware.
//
// app.js:
// 1. importar dependencias, DB, asociaciones y routers.
// 2. crear app. 3. registrar CORS, express.json, cookieParser.
// 4. registrar authRouter y los demas bajo /api.
// 5. iniciar DB y escuchar puerto.
//
// user.routes.js:
// Agregar authMiddleware + adminMiddleware para TODAS las rutas /users.
// Esto es autorizacion; NO alcanza con crear esos archivos sin usarlos.
//
// ================================================================================
// 15 - DONDE QUEDAMOS EN NUESTRO TP1 REAL HASTA LA ULTIMA REVISION
// ================================================================================
//
// IMPLEMENTADO Y PRACTICADO: modelos, asociaciones, CRUD User y Tag,
// POST Profile, POST/GET Article, ArticleTag POST/DELETE y Express Validator.
// IMPLEMENTADO LOCALMENTE Y PROBADO: borrado logico User/Article y
// eliminacion fisica Tag con limpieza de ArticleTag (pruebas del usuario).
// EL USUARIO CREO NUEVOS ARCHIVOS: helpers bcrypt/JWT, auth validation,
// auth controller, auth router, auth middleware y admin middleware.
// FALTA COMPROBAR EN EJECUCION: registro, login, cookies y perfil auth.
// FALTA CONECTAR: permisos admin a Users y permisos de Tags/Articles/ArticleTag.
// FALTA IMPLEMENTAR: ownerMiddleware y endpoints pendientes de Article.
// FALTA REVISAR: ruta antigua POST /profiles, que no quede publica.
// FALTA REVISAR: admin POST /users debe crear perfil si lo exige la consigna.
// FALTA REVISAR: esquema de MySQL y cascadas automaticas de FK.
// FALTA REVISAR: antiguos passwords en texto plano; NO funcionan como bcrypt.
//
// OJO AL USAR ESTA GUIA: si hiciste cambios locales posteriores, revisar
// git status y archivos reales. Esta lista es el ultimo estado conocido.
// OJO: no afirmar que el backend esta COMPLETO solo porque no hay errores
// de sintaxis. Hace falta comprobar comportamiento y permisos HTTP.
//
// ================================================================================
// 16 - PRUEBAS MINIMAS DE EXTREMO A EXTREMO
// ================================================================================
//
// PRIMERA PRUEBA: ejecutar node --check en app.js y demas archivos JS.
// SEGUNDA PRUEBA: npm run dev; ¿se conecta MySQL y abre el puerto?
// TERCERA PRUEBA: GET / debe devolver 200 si configuraste ruta de salud.
// CUARTA PRUEBA: POST /api/auth/register con usuario nuevo -> 201.
// QUINTA PRUEBA: revisar en MySQL password hasheada, no texto plano.
// SEXTA PRUEBA: POST /api/auth/login correcto -> 200 + cookie token.
// SEPTIMA PRUEBA: password incorrecta -> 401.
// OCTAVA PRUEBA: GET /api/auth/profile sin cookie -> 401.
// NOVENA PRUEBA: GET /api/auth/profile con cookie -> 200.
// DECIMA PRUEBA: GET /api/users con token de user -> 403.
// UNDECIMA PRUEBA: GET /api/users con token de admin -> 200.
// DUODECIMA PRUEBA: editar Article ajeno como user -> 403.
// DECIMOTERCERA PRUEBA: editar Article propio como user -> 200.
// DECIMOCUARTA PRUEBA: validar datos malos (400), IDs ausentes (404 si aplica).
// DECIMOQUINTA PRUEBA: User.destroy -> deleted_at; findAll no lo devuelve.
// DECIMOSEXTA PRUEBA: Article.destroy -> deleted_at y sin ArticleTags.
// DECIMOSEPTIMA PRUEBA: Tag.destroy -> borra tag, relaciones, conserva Article.
// DECIMOCTAVA PRUEBA: logout limpia cookie y GET perfil falla sin cookie.
//
// Si una prueba falla, revisar EN ORDEN:
// 1. Metodo y URL exactos (incluido prefijo /api).
// 2. Middleware global express.json y cookieParser.
// 3. Orden de middlewares en router y llamada next().
// 4. Validaciones y salida de validationResult.
// 5. req.params / req.body / req.cookies / req.user.
// 6. Imports/exports, nombres de funciones y alias de modelos.
// 7. Consola del backend; mensaje de error real.
// 8. Tablas, columnas y FK que existen en MySQL.
//
// ================================================================================
// 17 - CODIGOS HTTP DE MEMORIA
// ================================================================================
//
// 200 OK: consulta, actualizacion o eliminacion exitosa.
// 201 CREATED: creacion exitosa.
// 400 BAD REQUEST: datos de entrada invalidos.
// 401 UNAUTHORIZED: falta autenticacion valida.
// 403 FORBIDDEN: autenticado, pero sin permiso para la operacion.
// 404 NOT FOUND: recurso no encontrado.
// 500 INTERNAL SERVER ERROR: falla inesperada del servidor.
//
// No confundir status de validacion (400) con falta de permiso (403).
// No confundir JWT invalido (401) con recurso inexistente (404).
//
// ================================================================================
// 18 - GIT Y GITHUB: FLUJO DEL TP1 Y PR DE PRACTICA
// ================================================================================
//
// CONSIGNA ORIGINAL DE GIT:
// Repositorio llamado trabajo-practico-integrador-1.
// README inicial en main; develop creada desde main.
// proyecto-integrador creada desde develop.
// Al menos 10 commits descriptivos durante desarrollo en proyecto-integrador.
// Al terminar: merge limpio proyecto-integrador -> develop -> main.
//
// FLUJO ACTUAL DE TP1 PARA CAMBIOS NORMALES:
// 1. git switch proyecto-integrador
// 2. git status -sb
// 3. modificar archivos del recurso.
// 4. probar sintaxis, HTTP y git diff --check.
// 5. git add RUTAS_O_ARCHIVOS
// 6. git diff --cached --stat
// 7. git commit -m 'feat: descripcion del cambio'
// 8. git push origin proyecto-integrador
// 9. integrar proyecto-integrador -> develop y develop -> main cuando proceda.
//
// PR DE PRACTICA EN GITHUB:
// 1. git switch proyecto-integrador
// 2. git switch -c feature/endpoint-nuevo
// 3. editar, validar y probar.
// 4. git add ...
// 5. git commit -m 'feat: endpoint nuevo'
// 6. git push -u origin feature/endpoint-nuevo
// 7. En GitHub abrir Pull Request con base proyecto-integrador
//    y compare feature/endpoint-nuevo.
// 8. Leer Files changed y revisar que no haya secretos ni archivos extra.
// 9. Merge PR cuando este correcto.
// 10. git switch proyecto-integrador
// 11. git pull --ff-only origin proyecto-integrador
// 12. Si termino el TP, integrar hasta develop y main siguiendo consigna.
//
// IMPORTANTE: un Pull Request propone integrar CAMBIOS DE UNA RAMA en otra.
// Un commit guarda una version; un push publica commits locales en remoto.
// Un merge integra ramas; git status muestra el estado local.
// No usar force push por costumbre, ni reescribir fechas del trabajo evaluado.
//
// ================================================================================
// 19 - MINI EXAMEN MENTAL: PREGUNTAS QUE DEBES PODER CONTESTAR
// ================================================================================
//
// Que diferencia hay entre req.params, req.body y req.cookies?
// Que hace app.use('/api',router)?
// Por que importa el orden auth, owner/admin, validate y controlador?
// Para que sirven next(), matchedData() y validationResult()?
// Como se distingue un 400, 401, 403, 404 y 500?
// Que diferencia hay entre sequelize.authenticate() y sync()?
// Para que sirven PK, FK, unique y allowNull?
// Como configuras 1:1, 1:N y N:M con through y alias?
// Por que include necesita el mismo alias definido en la asociacion?
// Que diferencia hay entre destroy fisico y paranoid:true?
// Por que ON DELETE CASCADE no funciona con borrado logico?
// Que es una transaccion y por que evita estados a medias?
// Por que bcrypt.hash no se puede descifrar para recuperar password?
// Para que sirven bcrypt.compare, jwt.sign y jwt.verify?
// Por que JWT en cookie no significa permiso de administrador?
// Que genera req.user y por que no confiamos en role enviado en body?
// Por que las rutas /articles/user deben declararse antes de /articles/:id?
// Que diferencia hay entre helper, middleware y controlador?
// Que hace un PR y cual es la diferencia con commit y merge?
//
// ================================================================================
// 20 - PLAN DE EMERGENCIA SI TE QUEDAS EN BLANCO EN EL PRACTICO
// ================================================================================
//
// PRIMERO: Volver a leer UNA sola operacion de la consigna.
// SEGUNDO: Determinar metodo, URL, datos, permiso y respuesta esperada.
// TERCERO: Buscar un recurso parecido en nuestro TP1 de referencia.
// CUARTO: Copiar PATRON, no nombres, y adaptarlo a la entidad del examen.
// QUINTO: Confirmar nombres de importaciones, modelo, campos y alias.
// SEXTO: Probar esa operacion, antes de seguir con otra.
// SEPTIMO: Hacer commit solo del avance probado y coherente.
//
// ORDEN AL PENSAR:
// QUIEN ENVIA -> QUE ENVIA -> QUIEN PUEDE -> QUE VALIDO -> QUE HAGO
// -> DONDE GUARDO -> QUE RESPONDO -> COMO LO PRUEBO.
//
// FIN DE GUIA. LEER LA CONSIGNA REAL, REUTILIZAR PATRONES Y COMPROBAR RESULTADOS.
