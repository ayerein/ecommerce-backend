import CartsDAO from "../models/dao/CartsDAO.js"

class CartsService {
    constructor(dao) {
        this.dao = dao
    }

    async mergeCarts(guestCartId, userCartId) {
        const guestCart = await this.dao.findById(guestCartId)
        const userCart = await this.dao.findById(userCartId)

        if (guestCart && userCart) {
            guestCart.items.forEach(guestItem => {
                const guestProdId = guestItem.product._id?.toString() || guestItem.product.toString()

                const existingItem = userCart.items.find(p => {
                    const userProdId = p.product._id?.toString() || p.product.toString()
                    return userProdId === guestProdId
                })

                if (existingItem) {
                    existingItem.quantity += guestItem.quantity
                } else {
                    userCart.items.push(guestItem)
                }
            })

            await this.dao.save(userCart)
            await this.dao.delete(guestCartId)
        }
    }

    async createCart(data) {
        return await this.dao.create(data)
    }

    async deleteCartById(id) {
        return await this.dao.delete(id)
    }

    async getCart(cartId, userId) {
        let cart = null
        if (userId) cart = await this.dao.findActiveByUser(userId)
        if (!cart && cartId) cart = await this.dao.findById(cartId)
        return cart
    }

    async getCartById(id) {
        return await this.dao.findById(id)
    }

    async saveCart(cart) {
        return await this.dao.save(cart)
    }

    async deleteCartByUserId(userId) {
    return await this.dao.deleteByUserId(userId)
}
}

export default new CartsService(CartsDAO)