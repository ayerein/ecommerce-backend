import express from 'express'
import cors from 'cors'
import passport from 'passport'

import { dbConnection } from './config/db.js'
import productsRoutes from './routes/products.router.js'
import cartRoutes from './routes/cart.router.js'
import orderRoutes from './routes/order.router.js'

const app = express()

app.set("PORT", process.env.PORT || 3000)

dbConnection()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

initializePassport()
app.use(passport.initialize())

app.get("/", (req, res) => {
  res.send("API Ecommerce funcionando 🚀")
});

app.use("/api/products", productsRoutes)

app.use("/api/cart", cartRoutes)

app.use("/api/orders", orderRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto: ${PORT}`);
});