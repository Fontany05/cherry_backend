import express from "express";
import orderController from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

// Rutas específicas primero
router.get("/user/:userId", verifyToken, orderController.getUserOrders);
router.get(
  "/number/:orderNumber",
  verifyToken,
  orderController.getOrderByNumber,
);
router.get("/status/:status", verifyToken, orderController.getOrdersByStatus);
router.get(
  "/payment/status/:paymentStatus",
  verifyToken,
  orderController.getOrdersByPaymentStatus,
);

// Rutas con parámetros genéricos después
router.get("/:orderId", verifyToken, orderController.getOrderById);
router.patch(
  "/:orderId/status",
  verifyToken,
  orderController.updateOrderStatus,
);
router.patch(
  "/:orderId/payment-status",
  verifyToken,
  orderController.updatePaymentStatus,
);
router.patch("/:orderId/shipped", verifyToken, orderController.markAsShipped);
router.patch(
  "/:orderId/delivered",
  verifyToken,
  orderController.markAsDelivered,
);
router.delete("/:orderId/cancel", verifyToken, orderController.cancelOrder);

export default router;
