import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Cart {
  constructor(data) {
    this.data = data;
  }

  static get model() {
    return "Carts";
  }

  static get schema() {
    return {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        unique: true,
      },
      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Products",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
      subtotal: {
        type: Number,
        default: 0,
      },
      shippingCost: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
      // NUEVO: Para limpiar carritos abandonados
      expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        index: { expires: "30d" }, // TTL index para auto-eliminación
      },
    };
  }
}
