import { cartService } from "../services/index.js";
import { ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";

// Obtener el carrito del usuario logueado
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id; // Sacado del token
    const cart = await cartService.getCart(userId);

    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};
// Agregar producto (usa ID del token)
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
      throw new ClientError("ProductId, quantity, and price are required");
    }

    const cart = await cartService.addToCart(
      userId,
      productId,
      quantity,
      price,
    );
    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

//  Eliminar producto
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      throw new ClientError("productId is required");
    }

    const cart = await cartService.removeFromCart(userId, productId);
    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

// Actualizar cantidad
const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      throw new ClientError("productId and quantity are required");
    }

    const cart = await cartService.updateQuantity(userId, productId, quantity);
    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

// Vaciar carrito
const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);
    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};
