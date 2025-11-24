import express from "express";
import cartController from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.get("/:userId", verifyToken, cartController.getCart);
router.post("/:userId/add", verifyToken, cartController.addToCart);
router.delete("/:userId/remove", verifyToken, cartController.removeFromCart);
router.patch("/:userId/update", verifyToken, cartController.updateQuantity);
router.delete("/:userId/clear", verifyToken, cartController.clearCart);

export default router;