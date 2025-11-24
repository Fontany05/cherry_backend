import Stripe from "stripe";
import config from "../config/config.js";
import { orderService } from "../services/index.js";
import { ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";

// Inicializamos Stripe con la clave secreta
const stripe = new Stripe(config.stripeSecretKey);

//create payment intent
const createPaymentIntent = async (req, res, next) => {
  const { userId, items, shippingAddress, paymentMethod } = req.body;
  try {
    if (!userId || !items || items.length === 0) {
      throw new ClientError("userId and items are required");
    }

    //calcular total de pedido
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const shippingCost = 0;
    const total = subtotal + shippingCost;

    // Crear PaymentIntent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { userId },
    });


    //crear pedido en bdd
    const order = await orderService.insert({
      orderNumber: `ORD-${Date.now()}`,
      userId,
      items,
      shippingAddress,
      subtotal,
      shippingCost,
      total,
      currency: "usd",
      paymentStatus: "pending",
      paymentIntentId: paymentIntent.id,
      paymentClientSecret: paymentIntent.client_secret,
    });
    response(res, 200, {
      client_secret: paymentIntent.client_secret,
      orderId: order._id,
      total,
    });
  } catch (error) {
    next(error);
  }
};

//confirm payment
const confirmPayment = async (req, res, next) => {
  const { paymentIntentId } = req.body;
  try {
    if (!paymentIntentId) {
      throw new ClientError("paymentIntentId is required");
    }
    //obtener paymenIntent de stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //actualzar estado del pedido segun el resultado del pago
    if (paymentIntent.status === "succeeded") {
      await orderService.update(
        { paymentIntentId },
        { paymentStatus: "completed" }
      );
      response(res, 200, { status: "completed", paymentIntent });
    } else if (paymentIntent.status === "processing") {
      response(res, 200, { status: "processing", paymentIntent });
    } else {
      throw new ClientError("payment failed or is pending");
    }
  } catch (error) {
    next(error);
  }
};

// Webhook de Stripe
const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripeWebhookSecret
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        await orderService.update(
          { paymentIntentId: event.data.object.id },
          { paymentStatus: "completed" }
        );
        break;
      case "payment_intent.payment_failed":
        await orderService.update(
          { paymentIntentId: event.data.object.id },
          { paymentStatus: "failed" }
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    response(res, 200, { received: true });
  } catch (error) {
    next(error);
  }
};

// Obtener detalles del pedido
const getOrderDetails = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getBy({ _id: orderId });
    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Cancelar pago
const cancelPayment = async (req, res, next) => {
  const { paymentIntentId } = req.body;
  try {
    if (!paymentIntentId) {
      throw new ClientError("paymentIntentId is required");
    }

    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    await orderService.update(
      { paymentIntentId },
      { paymentStatus: "cancelled" }
    );

    response(res, 200, { status: "cancelled", paymentIntent });
  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
  getOrderDetails,
  cancelPayment,
};
