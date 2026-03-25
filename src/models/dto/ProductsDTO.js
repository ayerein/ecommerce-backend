export default class ProductDTO {
    constructor(product) {
        this._id = product._id
        this.nombre_producto = product.nombre_producto
        this.marca_producto = product.marca_producto
        this.descripcion_producto = product.descripcion_producto
        this.precio_producto = product.precio_producto
        this.img_producto = product.img_producto
        this.nombre_categoria = product.nombre_categoria
        this.stock_producto = product.stock_producto
        this.codigo_barras = product.codigo_barras
    }
}