import Cart from "../models/cart.model.js";
import Orders from "../models/order.model.js";
import Product from "../models/product.model.js";

export const CreateOrder = async (req, res) => {
  try {
    const { cartId } = req.body

    const cart = await Cart.findById(cartId).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrito vacío" })
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Stock insuficiente para ${item.product.nombre}`
        })
      }
    }

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock_producto: -item.quantity }
      })
    }

    const order = await Orders.create({
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.precio_producto
      })),
      total: cart.items.reduce((acc, item) =>
        acc + item.product.precio_producto * item.quantity, 0)
    })

    cart.items = []
    await cart.save()

    res.json(order)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}