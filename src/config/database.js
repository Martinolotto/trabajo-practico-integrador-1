//crear y exportar una configuración de Sequelize para que el resto del proyecto pueda utilizarla

import "dotenv/config"; //leer .env
import { Sequelize } from "sequelize"

//crea y exporta una instancia de sequelize 
//conf para trabajar con nuestra bd mysql
export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
{
    host: process.env.DB_HOST,
    dialect: "mysql"
})

//prueba de conexion a la base de datos 

export const startDB = async ()=>{
    try{
        await sequelize.authenticate();
        console.log("conexion a MySQL establecida correctamente");

        await sequelize.sync()
        // await sequelize.sync({ force: true })
        console.log("modelos sincronizdos correctamente");
        
    }catch (error){
        console.error("error al conectar con MySQL", error);
        throw error;
    }
    
}