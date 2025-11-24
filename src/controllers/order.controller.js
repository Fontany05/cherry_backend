import { orderService } from "../services/index.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";

// Obtener todas las órdenes del usuario
const getUserOrders = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const orders = await orderService.getUserOrders(userId);

    if (!orders || orders.length === 0) {
      throw new NotFoundError("No orders found for this user");
    }

    response(res, 200, orders);
  } catch (error) {
    next(error);
  }
};

// Obtener una orden por ID
const getOrderById = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Obtener una orden por número
const getOrderByNumber = async (req, res, next) => {
  const { orderNumber } = req.params;
  try {
    const order = await orderService.getOrderByNumber(orderNumber);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de la orden
const updateOrderStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    if (!status) {
      throw new ClientError("status is required");
    }

    const validStatuses = ["pending", "paid", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new ClientError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await orderService.updateOrderStatus(orderId, status);

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Actualizar estado de pago
const updatePaymentStatus = async (req, res, next) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;
  try {
    if (!paymentStatus) {
      throw new ClientError("paymentStatus is required");
    }

    const validPaymentStatuses = ["pending", "paid", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new ClientError(`Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}`);
    }

    const order = await orderService.updatePaymentStatus(
      orderId,
      paymentStatus,
      new Date()
    );

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Marcar como enviada
const markAsShipped = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.markAsShipped(orderId);

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Marcar como entregada
const markAsDelivered = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.markAsDelivered(orderId);

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Cancelar orden
const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await orderService.cancelOrder(orderId);

    response(res, 200, order);
  } catch (error) {
    next(error);
  }
};

// Obtener órdenes por estado
const getOrdersByStatus = async (req, res, next) => {
  const { status } = req.query;
  try {
    if (!status) {
      throw new ClientError("status query parameter is required");
    }

    const orders = await orderService.getOrdersByStatus(status);

    if (!orders || orders.length === 0) {
      throw new NotFoundError(`No orders found with status: ${status}`);
    }

    response(res, 200, orders);
  } catch (error) {
    next(error);
  }
};

// Obtener órdenes por estado de pago
const getOrdersByPaymentStatus = async (req, res, next) => {
  const { paymentStatus } = req.query;
  try {
    if (!paymentStatus) {
      throw new ClientError("paymentStatus query parameter is required");
    }

    const orders = await orderService.getOrdersByPaymentStatus(paymentStatus);

    if (!orders || orders.length === 0) {
      throw new NotFoundError(`No orders found with payment status: ${paymentStatus}`);
    }

    response(res, 200, orders);
  } catch (error) {
    next(error);
  }
};

export default {
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  updateOrderStatus,
  updatePaymentStatus,
  markAsShipped,
  markAsDelivered,
  cancelOrder,
  getOrdersByStatus,
  getOrdersByPaymentStatus,
};