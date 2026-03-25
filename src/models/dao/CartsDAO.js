import Cart from "../cart.model.js"

class CartsDAO {
    async create(data) {
        const cart = await Cart.create(data)
        return await cart.populate("items.product")
    }

    async delete(id) {
        return await Cart.findOneAndDelete(id)
    }

    async findActiveByUser(userId) {
        return await Cart.findOne({ user: userId, status: 'active' }).populate("items.product")
    }

    async findById(id) {
        return await Cart.findById(id).populate("items.product")
    }

    async save(cartInstance) {
        await cartInstance.save()
        return await cartInstance.populate("items.product")
    }

    async deleteByUserId(userId) {
        return await Cart.findOneAndDelete({ user: userId })
    }
}

export default new CartsDAO()