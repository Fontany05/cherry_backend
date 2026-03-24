import express from "express";
import cartController from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
import {
  validateAddToCart,
  validateUpdateQuantity,
  validateRemoveFromCart,
} from "../middlewares/validators/cart.validator.js";

const router = express.Router();

router.get("/", verifyToken, cartController.getCart);
router.post("/add", verifyToken, validateAddToCart, cartController.addToCart);
router.delete(
  "/remove",
  verifyToken,
  validateRemoveFromCart,
  cartController.removeFromCart,
);
router.put(
  "/update",
  verifyToken,
  validateUpdateQuantity,
  cartController.updateQuantity,
);
router.delete("/clear", verifyToken, cartController.clearCart);

export default router;
