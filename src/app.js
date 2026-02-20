import express from 'express'
import cors from 'cors'
import { dbConnection } from './config/db.js'
import productsRoutes from './routes/products.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'

const app = express()
app.set("PORT", process.env.PORT || 3000)

dbConnection()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API Ecommerce funcionando 🚀")
});

app.use("/api/products", productsRoutes)

app.use("/api/cart", cartRoutes)

app.use("/api/orders", orderRoutes)

app.listen(app.get("PORT"), () => {
  console.log(`Escuchando servidor en puerto http://localhost:${app.get("PORT")}`)
});