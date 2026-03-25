import ProductsDAO from "../models/dao/ProductsDAO.js"

class ProductsService {
    constructor(dao) {
        this.dao = dao
    }

    async createNewProduct(data) {
        return await this.dao.createProduct(data)
    }

    async deleteProductById(id) {
        return await this.dao.deleteProduct(id)
    }

    async updateProductById(id, data) {
        return await this.dao.updateProduct(id, data)
    }

    async getProductById(id) {
        return await this.dao.getProduct(id)
    }

    async getAllProducts(params) {
        const { page = 1, limit = 8, search, inStock, category, minPrice, maxPrice, sort="name_asc" } = params

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

        const priceFilter = {}
        if (minPrice) priceFilter.$gte = Number(minPrice)
        if (maxPrice) priceFilter.$lte = Number(maxPrice)

        if (Object.keys(priceFilter).length) {
            filter.precio_producto = priceFilter
        }

        let sortOption = { nombre_producto: 1 }

        switch (sort) {
        case "name_desc":
            sortOption = { nombre_producto: -1 }
            break
        case "price_asc":
            sortOption = { precio_producto: 1 }
            break
        case "price_desc":
            sortOption = { precio_producto: -1 }
            break
        case "stock_desc":
            sortOption = { stock_producto: -1 }
            break
        case "stock_asc":
            sortOption = { stock_producto: 1 }
            break
        }

        const options = {
            page: Number(page),
            limit: Number(limit),
            sort: { ...sortOption, _id: 1 },
        }

        return await this.dao.getProducts(filter, options)
    }

    async getCategories() {
        return await this.dao.getCategories()
    }

}

export default new ProductsService(ProductsDAO)