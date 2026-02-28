import { Router } from "express";
import { CreateOrder } from "../controllers/order.controller.js";
import { passportAuth } from "../middlewares/passportAuth.js";

const router = Router();

router.post('/', passportAuth('jwt'), CreateOrder)

export default router;