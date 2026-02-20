import { Router } from "express";
import { createCart, addProductToCart, getCartById, deleteProduct, clearCart } from "../controllers/cart.controller.js";

const router = Router();

router.post('/', createCart)

router.post('/add', addProductToCart)

router.delete('/:cartId/product/:productId', deleteProduct)

router.delete('/:cartId', clearCart)

router.get('/:id', getCartById)

export default router;