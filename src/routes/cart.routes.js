import express from "express";
import cartController from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/", verifyToken, cartController.getCart);
router.post("/add", verifyToken, cartController.addToCart);
router.delete("/remove", verifyToken, cartController.removeFromCart);
router.put("/update", verifyToken, cartController.updateQuantity);
router.delete("/clear", verifyToken, cartController.clearCart);

export default router;