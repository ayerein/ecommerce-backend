import Cart from "../models/cart.model.js"
import Orders from "../models/order.model.js"
import Product from "../models/product.model.js"

export const CreateOrder = async (req, res) => {
  try {
    const cartId = req.user.cart
    const userId = req.user._id

    const cart = await Cart.findById(cartId).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Carrito vacío" })
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock_producto) {
        return res.status(400).json({
          message: `Stock insuficiente para ${item.product.nombre_producto}`
        })
      }
    }

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock_producto: -item.quantity }
      })
    }

    const order = await Orders.create({
      user: userId,
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

export const GetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query

    let query = {}

    if (req.user.role !== 'admin') {
        query = { user: req.user._id }
    }
  
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        lean: true,
        populate: [
            { path: 'user', select: 'first_name last_name email' }, 
            { path: 'items.product' }
        ],
        sort: { purchase_datetime: -1 }
      }

    const orders = await Orders.paginate(query, options)

    res.status(200).json({
        status: "success",
        payload: orders.docs,
        totalPages: orders.totalPages,
        prevPage: orders.prevPage,
        nextPage: orders.nextPage,
        page: orders.page,
        hasPrevPage: orders.hasPrevPage,
        hasNextPage: orders.hasNextPage
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const UpdateOrderStatus = async (req, res) => {
  try {
        const { id } = req.params
        const { status } = req.body

        const updatedOrder = await Orders.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true }
        )

        res.status(200).json({ status: "success", payload: updatedOrder })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
