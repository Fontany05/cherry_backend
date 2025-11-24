import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Order {
  constructor(data) {
    this.data = data;
  }

  static get model() {
    return "Orders";
  }

  static get schema() {
    return {
      orderNumber: {
        type: String,
        required: true,
        unique: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },

      items: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Products",
          },
          name: {
            type: String,
            required: true,
          },
          brand: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: false,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            type: Number,
            required: true,
          },
          subtotal: {
            type: Number,
            required: true,
          },
        },
      ],

      shippingAddress: {
        fullName: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: false,
        },
        zipCode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          default: "Argentina",
        },
        phone: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          required: false,
          maxlength: 500,
        },
      },

      subtotal: {
        type: Number,
        required: true,
      },
      shippingCost: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "usd",
      },

      status: {
        type: String,
        enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
        default: "pending",
      },

      paymentMethod: {
        type: String,
        enum: ["card", "cash"], 
        default: "card",
      },

      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      //Campos relacionados con Stripe
      paymentIntentId: {
        type: String,
        required: false,
      },
      paymentClientSecret: {
        type: String,
        required: false,
      },
      paymentTransactionId: {
        type: String,
        required: false,
      },

      paidAt: {
        type: Date,
        required: false,
      },
      shippedAt: {
        type: Date,
        required: false,
      },
      deliveredAt: {
        type: Date,
        required: false,
      },
    };
  }
}
