export default class CartDTO {
    constructor(cart) {
        this._id = cart._id || cart.id

        this.items = (cart.items || []).map(item => {
            const prod = item.product || {}
            return {
                quantity: item.quantity,
                product: {
                    _id: prod._id,
                    nombre_producto: prod.nombre_producto,
                    precio_producto: prod.precio_producto,
                    img_producto: prod.img_producto,
                    stock_producto: prod.stock_producto
                }
            }
        })

        this.totalPrice = this.items.reduce((acc, item) => {
            return acc + (item.product.precio_producto * item.quantity)
        }, 0)

        this.totalUnits = this.items.reduce((acc, item) => acc + item.quantity, 0)
    }
}