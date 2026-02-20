import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config()

const mongo_url = (process.env.MONGO_URL)

export const dbConnection = async () => {
    try {
        await mongoose.connect(mongo_url)
        console.log("Base de datos conectada")
    } catch (error) {
        console.log("Error al conectar la base de datos", error)        
    }
}