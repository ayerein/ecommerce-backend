import express from 'express'
import cors from 'cors'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import { dbConnection } from './config/db.js'
import initializePassport from './config/passport.js'

import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import orderRouter from './routes/order.router.js'
import sessionsRouter from './routes/sessions.router.js'

const app = express()

app.set("PORT", process.env.PORT || 3000)

dbConnection()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser(process.env.COOKIE_SECRET))

initializePassport()
app.use(passport.initialize())

app.get("/", (req, res) => {
  res.send("API Ecommerce funcionando 🚀")
});

app.use("/api/products", productsRouter)

app.use("/api/cart", cartRouter)

app.use("/api/orders", orderRouter)

app.use("/api/sessions", sessionsRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`)
})