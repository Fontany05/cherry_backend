import express from "express";
import orderController from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

// Obtener todas las órdenes del usuario
router.get("/user/:userId", verifyToken, orderController.getUserOrders);

// Obtener una orden por ID
router.get("/:orderId", verifyToken, orderController.getOrderById);

// Obtener una orden por número
router.get("/number/:orderNumber", verifyToken, orderController.getOrderByNumber);

// Actualizar estado de la orden
router.patch("/:orderId/status", verifyToken, orderController.updateOrderStatus);

// Actualizar estado de pago
router.patch("/:orderId/payment-status", verifyToken, orderController.updatePaymentStatus);

// Marcar como enviada
router.patch("/:orderId/shipped", verifyToken, orderController.markAsShipped);

// Marcar como entregada
router.patch("/:orderId/delivered", verifyToken, orderController.markAsDelivered);

// Cancelar orden
router.delete("/:orderId/cancel", verifyToken, orderController.cancelOrder);

// Obtener órdenes por estado
router.get("/status/:status", verifyToken, orderController.getOrdersByStatus);

// Obtener órdenes por estado de pago
router.get("/payment/status/:paymentStatus", verifyToken, orderController.getOrdersByPaymentStatus);

export default router;