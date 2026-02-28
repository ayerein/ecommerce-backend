import { createProduct, getProducts, deleteProduct, updateProduct, getProductId, getCategories } from "../controllers/products.controller.js";
import { Router } from "express"
import { isAdmin } from "../middlewares/isAdmin.js";
import { passportAuth } from "../middlewares/passportAuth.js";

const router = Router()

router.get('/', getProducts)

router.get('/categories', getCategories)

router.get('/:id', getProductId)


router.post('/', passportAuth('jwt'), isAdmin, createProduct)

router.delete('/:id', passportAuth('jwt'), isAdmin, deleteProduct)

router.put('/:id', passportAuth('jwt'), isAdmin, updateProduct)


export default router