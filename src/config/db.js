import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config()

const mongo_uri = (process.env.MONGO_URI)

export const dbConnection = async () => {
    try {
        await mongoose.connect(mongo_uri)
        console.log("Base de datos conectada")
    } catch (error) {
        console.log("Error al conectar la base de datos", error)        
    }
}