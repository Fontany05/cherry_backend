import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Product {
  constructor(data) {
    this.data = data;
  }

  static get model() {
    return "Products";
  }

  static get schema() {
    return {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
        unique: true,
      },
      price: {
        type: Number,
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
      cloudinary_id: {
        type: String,
        required: false,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      categories: {
        type: String,
        required: true,
        enum: ["skincare", "makeup", "sets", "beauty-tools"],
      },
      subcategory: {
        type: String,
        required: false,
        enum: [
          "lipstick",
          "mascara",
          "blush",
          "eyeliner",
          "cushions",
          "eyeshadows",
        ],
      },
      active: {
        type: Boolean,
        default: true,
      },
      featured: {
        type: Boolean,
        default: false,
      },
    };
  }
}