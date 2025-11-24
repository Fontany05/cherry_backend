import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();

router.post("/create-intent", verifyToken, paymentController.createPaymentIntent);

router.post("/confirm", verifyToken, paymentController.confirmPayment);

router.get("/:orderId", verifyToken, paymentController.getOrderDetails);

router.post("/cancel", verifyToken, paymentController.cancelPayment);

// Webhook de Stripe (SIN autenticación, Stripe lo necesita así)
router.post("/webhook", paymentController.handleStripeWebhook);

export default router;