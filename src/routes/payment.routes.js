import express from "express";
import paymentController from "../controllers/payment.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
import { validateCreatePaymentIntent, validateConfirmPayment, validateCancelPayment } from "../middlewares/validators/payment.validator.js";

const router = express.Router();

router.post("/create-intent", verifyToken, validateCreatePaymentIntent, paymentController.createPaymentIntent);

router.post("/confirm", verifyToken, validateConfirmPayment, paymentController.confirmPayment);

router.get("/:orderId", verifyToken, paymentController.getOrderDetails);

router.post("/cancel", verifyToken, validateCancelPayment, paymentController.cancelPayment);

// Webhook de Stripe (SIN autenticación, Stripe lo necesita así)
router.post("/webhook", paymentController.handleStripeWebhook);

export default router;