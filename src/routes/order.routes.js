import { Router } from "express";
import { CreateOrder } from "../controllers/order.controller.js";

const router = Router();

router.post('/', CreateOrder)

export default router;