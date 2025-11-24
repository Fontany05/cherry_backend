import Order from "../database/models/order.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class OrderService extends GenericQueries {
  constructor(dao) {
    super(dao, Order.model);
  }

  // Obtener todas las órdenes de un usuario
  async getUserOrders(userId) {
    return await this.getBy({ userId });
  }

  // Obtener una orden por ID
  async getOrderById(orderId) {
    return await this.getBy({ _id: orderId });
  }

  // Obtener una orden por número de orden
  async getOrderByNumber(orderNumber) {
    return await this.getBy({ orderNumber });
  }

  // Crear una nueva orden
  async createOrder(orderData) {
    return await this.insert(orderData);
  }

  // Actualizar estado de la orden
  async updateOrderStatus(orderId, status) {
    return await this.update(orderId, { status });
  }

  // Actualizar estado de pago
  async updatePaymentStatus(orderId, paymentStatus, paidAt = null) {
    const updateData = { paymentStatus };
    if (paidAt) {
      updateData.paidAt = paidAt;
    }
    return await this.update(orderId, updateData);
  }

  // Marcar como enviada
  async markAsShipped(orderId, shippedAt = new Date()) {
    return await this.update(orderId, {
      status: "shipped",
      shippedAt,
    });
  }

  // Marcar como entregada
  async markAsDelivered(orderId, deliveredAt = new Date()) {
    return await this.update(orderId, {
      status: "delivered",
      deliveredAt,
    });
  }

  // Cancelar orden
  async cancelOrder(orderId) {
    return await this.update(orderId, { status: "cancelled" });
  }

  // Obtener órdenes por estado
  async getOrdersByStatus(status) {
    return await this.getAll({ status });
  }

  // Obtener órdenes por estado de pago
  async getOrdersByPaymentStatus(paymentStatus) {
    return await this.getAll({ paymentStatus });
  }
}
