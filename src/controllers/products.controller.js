import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      message: "Producto eliminado correctamente",
      product: deletedProduct
    });
  } catch (error) {
    res.status(400).json({ message: "ID inválido" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, search, inStock, category, minPrice, maxPrice, sort="name_asc" } = req.query;

    const filter = {}

    if (inStock === "true") { filter.stock_producto = { $gt: 0 } }

    if (search) {
      filter.$or = [
        { nombre_producto: { $regex: search, $options: "i" } },
        { codigo_barras: { $regex: search, $options: "i" } }
      ]
    }

    if (category) {
      filter.nombre_categoria = category
    }

    const priceFilter = {};
    if (minPrice) priceFilter.$gte = Number(minPrice)
    if (maxPrice) priceFilter.$lte = Number(maxPrice)

    if (Object.keys(priceFilter).length) {
      filter.precio_producto = priceFilter
    }

    let sortOption = { nombre_producto: 1 }

    switch (sort) {
      case "name_desc":
        sortOption = { nombre_producto: -1 }
        break;
      case "price_asc":
        sortOption = { precio_producto: 1 }
        break;
      case "price_desc":
        sortOption = { precio_producto: -1 }
        break;
      case "stock_desc":
        sortOption = { stock_producto: -1 }
        break;
      case "stock_asc":
        sortOption = { stock_producto: 1 }
        break;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { ...sortOption, _id: 1 },
    };

    const products = await Product.paginate(filter, options)

    res.json(products)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("nombre_categoria");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  }