import CartDTO from "../models/dto/CartsDTO.js"
import cartService from "../services/cart.service.js"
import productServices from "../services/product.services.js"


export const createCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    if (!productId) {
      return res.status(400).json({ message: "productId es requerido" })
    }

    const cart = await cartService.createCart(productId, quantity)

    res.status(201).json(new CartDTO(cart))
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const addProductToCart = async (req, res) => {
  try {
    const { cartId, productId, quantity = 1 } = req.body

    const userId = req.user?._id

    if (!productId) {
      return res.status(400).json({ message: "productId es requerido" })
    }

    const product = await productServices.getProductById(productId)

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    let cart = await cartService.getCart(cartId, userId)

    if (!cart) {
      cart = await cartService.createCart({
        user: userId || null,
        items: [{ product: productId, quantity }]
      })
      return res.status(201).json(new CartDTO(newCart))
    }

    if (userId && !cart.user) {
      cart.user = userId
    }

    const itemIndex = cart.items.findIndex(item => 
      (item.product._id || item.product).toString() === productId
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


    const updatedCart = await cartService.saveCart(cart)
    res.json(new CartDTO(updatedCart))

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getCartById = async (req, res) => {
    const { id } = req.params

    const cart = await cartService.getCartById(id)

    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" })
    }

    res.json(new CartDTO(cart))
} 

export const deleteProduct = async (req, res) => {
  try {
    const { cartId, productId } = req.params

    const cart = await cartService.getCartById(cartId)

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" })
    }

    const itemIndex = cart.items.findIndex(item => {
        const idEnCarrito = item.product._id ? item.product._id.toString() : item.product.toString();
        return idEnCarrito === productId;
    })

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Producto no está en el carrito" })
    }

    cart.items.splice(itemIndex, 1)

    const updatedCart = await cartService.saveCart(cart)

    res.json(new CartDTO(updatedCart))

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.params

    const cart = await cartService.getCartById(cartId)

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" })
    }

    cart.items = []
    const updatedCart = await cartService.saveCart(cart)

    res.json(new CartDTO(updatedCart))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}