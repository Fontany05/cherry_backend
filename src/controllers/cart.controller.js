import { cartService } from "../services/index.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";

//Get user cart
const getCart = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const cart = await cartService.getCart(userId);

    if (!cart) {
      throw new NotFoundError("cart not found");
    }
    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

//add product to cart
const addToCart = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity, price } = req.body;

  try {
    if (!productId || !quantity || !price) {
      throw new ClientError("ProductId, quantity, and price are required");
    }

    const cart = await cartService.addToCart(
      userId,
      productId,
      quantity,
      price
    );

    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

//Remove product from cart
const removeFromCart = async (req, res, next) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    if (!productId) {
      throw new ClientError("productId is required");
    }

    const cart = await cartService.removeFromCart(userId, productId);

    response(res, 200, cart);
  } catch (error) {
    next(error);

  }
};

//Update quantity of a product
const updateQuantity = async (req, res, next) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    if (!productId || !quantity) {
      throw new ClientError("productId and quantity are required");
    }

    if (quantity < 1) {
      throw new ClientError("The amount must be greater than 0");
    }

    const cart = await cartService.updateQuantity(userId, productId, quantity);

    response(res, 200, cart);
  } catch (error) {
    next(error);
  }
};

// clear cart
const clearCart = async (req, res, next) => {
  const { userId } = req.params;

  try {
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