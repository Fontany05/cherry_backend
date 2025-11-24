import Cart from "../database/models/cart.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class CartService extends GenericQueries {
  constructor(dao) {
    super(dao, Cart.model);
  }

  // Obtener carrito de un usuario
  async getCart(userId) {
    return await this.getBy({ userId });
  }

  // Agregar producto al carrito
  async addToCart(userId, productId, quantity, price) {
    let cart = await this.getBy({ userId });

    if (!cart) {
      // Si no existe carrito, crear uno nuevo
      cart = await this.insert({
        userId,
        items: [{ productId, quantity, price }],
        subtotal: price * quantity,
        total: price * quantity,
      });
    } else {
      // Si existe, buscar si el producto ya está en el carrito
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex !== -1) {
        // Producto ya existe, aumentar cantidad
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Producto no existe, agregarlo
        cart.items.push({ productId, quantity, price });
      }

      // Recalcular totales
      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      cart = await this.update(cart._id, {
        items: cart.items,
        subtotal,
        total: subtotal + (cart.shippingCost || 0),
      });
    }

    return cart;
  }

  // Eliminar producto del carrito
  async removeFromCart(userId, productId) {
    const cart = await this.getBy({ userId });

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return await this.update(cart._id, {
      items: cart.items,
      subtotal,
      total: subtotal + (cart.shippingCost || 0),
    });
  }

  // Actualizar cantidad de un producto
  async updateQuantity(userId, productId, quantity) {
    const cart = await this.getBy({ userId });

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      throw new Error("Producto no encontrado en el carrito");
    }

    item.quantity = quantity;

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return await this.update(cart._id, {
      items: cart.items,
      subtotal,
      total: subtotal + (cart.shippingCost || 0),
    });
  }

  // Vaciar carrito
  async clearCart(userId) {
    const cart = await this.getBy({ userId });

    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    return await this.update(cart._id, {
      items: [],
      subtotal: 0,
      total: 0,
    });
  }
}