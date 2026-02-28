import Cart from "../models/cart.model.js"

export const mergeCarts = async (guestCartId, userCartId) => {
    const guestCart = await Cart.findById(guestCartId)
    const userCart = await Cart.findById(userCartId)

    if (guestCart && userCart) {
        guestCart.items.forEach(guestItem => {
            const existingItem = userCart.items.find(
                p => p.product.toString() === guestItem.product.toString()
            )

            if (existingItem) {
                existingItem.quantity += guestItem.quantity
            } else {
                userCart.items.push(guestItem)
            }
        })

        await userCart.save();
        await Cart.findByIdAndDelete(guestCartId)
    }
}