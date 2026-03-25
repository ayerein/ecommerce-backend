import Product from "../product.model.js"

class ProductsDAO {
    async createProduct(data) {
        return await Product.create(data)
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id)
    }

    async updateProduct(id, data) {
        return await Product.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        )
    }

    async getProduct(id) {
        return await Product.findById(id)
    }

    async getProducts(filter, options) {
        return await Product.paginate(filter, options)
    }

    async getCategories() {
        return await Product.distinct("nombre_categoria")
    }
}

export default new ProductsDAO()