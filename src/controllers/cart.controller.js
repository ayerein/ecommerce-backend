import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const createCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId es requerido" })
    }

    const cart = await Cart.create({
      items: [
        {
          product: productId,
          quantity
        }
      ]
    })

    const populatedCart = await cart.populate("items.product")

    res.status(201).json(populatedCart)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId es requerido" })
    }

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    let cart

    if (!cartId) {
      cart = await Cart.create({
          items: [{ product: productId, quantity }]
      })
      await cart.populate("items.product")
      return res.status(201).json(cart)
    }

    cart = await Cart.findById(cartId)

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" })
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex !== -1) {
      const currentQuantityInCart = cart.items[itemIndex].quantity
      const newQuantity = currentQuantityInCart + quantity

      if (newQuantity > product.stock_producto) {
        return res.status(409).json({
          message: "Stock insuficiente"
        })
      }

      cart.items[itemIndex].quantity = newQuantity
      
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1)
      }
    } else {
      if (quantity > product.stock_producto) {
        return res.status(400).json({
          message: `No hay suficiente stock. Disponible: ${product.stock}`
        })
      }
  
      cart.items.push({ product: productId, quantity })
    }


    await cart.save()
    await cart.populate("items.product")

    res.json(cart)

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartById = async (req, res) => {
    const { id } = req.params

    const cart = await Cart.findById(id).populate("items.product")

    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" })
    }

    res.json(cart)
} 

export const deleteProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params

    const cart = await Cart.findById(cartId)

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" })
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    )

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Producto no está en el carrito" })
    }

    cart.items.splice(itemIndex, 1)

    await cart.save()

    await cart.populate("items.product")

    res.json(cart)

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params

    const cart = await Cart.findById(cartId)

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" })
    }

    cart.items = []
    await cart.save()
    await cart.populate("items.product")

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}