import { Router } from "express";
import { CreateOrder, GetOrders, UpdateOrderStatus } from "../controllers/order.controller.js"
import { passportAuth } from "../middlewares/passportAuth.js"

const router = Router();

router.post('/', passportAuth('jwt'), CreateOrder)

router.get('/', passportAuth('jwt'), GetOrders)

router.put('/:id', passportAuth('jwt'), UpdateOrderStatus)

export default router;