import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class User {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Users";
  }
  static get schema() {
    return {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: false,
      },
      telephone: {
        type: String,
        required: false,
      },
      role: { type: String, enum: ["admin", "user", "moderator"], default: "user" },
    };
  }
}
