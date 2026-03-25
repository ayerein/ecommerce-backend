import ProductDTO from "../models/dto/ProductsDTO.js"
import productServices from "../services/product.services.js"


export const createProduct = async (req, res) => {
  try {
    const product = await productServices.createNewProduct(req.body)
    res.status(201).json(new ProductDTO(product))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params

    const deletedProduct = await productServices.deleteProductById(id)

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    const productClean = new ProductDTO(deletedProduct)

    res.status(200).json({
      message: "Producto eliminado correctamente",
      product: productClean
    })
  } catch (error) {
    res.status(400).json({ message: "ID inválido" })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    const updatedProduct = await productServices.updateProductById(id, data)

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" })
    }

    res.status(200).json(new ProductDTO(updatedProduct))
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getProductId = async (req, res) => {
  try {
    const { id } = req.params

    const product = await productServices.getProductById(id)
    res.status(200).json(new ProductDTO(product))
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProducts = async (req, res) => {
  try {
    const queryParams = req.query

    const products = await productServices.getAllProducts(queryParams)

    const productsClean = products.docs.map(p => new ProductDTO(p))

    res.json({
        ...products,
        docs: productsClean
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await productServices.getCategories()
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}