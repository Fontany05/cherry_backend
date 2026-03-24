import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, data: errors.array() });
  }
  next();
};

export const validateCreatePaymentIntent = [
  body("userId")
    .notEmpty()
    .withMessage("UserId is required")
    .isMongoId()
    .withMessage("Invalid userId format"),

  body("items")
    .notEmpty()
    .withMessage("Items are required")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("ProductId is required")
    .isMongoId()
    .withMessage("Invalid productId format"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("items.*.price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("items.*.subtotal")
    .notEmpty()
    .withMessage("Subtotal is required")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number"),

  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required"),

  body("shippingAddress.address").notEmpty().withMessage("Address is required"),

  body("shippingAddress.city").notEmpty().withMessage("City is required"),

  body("shippingAddress.zipCode")
    .notEmpty()
    .withMessage("Zip code is required"),

  body("shippingAddress.phone").notEmpty().withMessage("Phone is required"),

  handleValidationErrors,
];

export const validateConfirmPayment = [
  body("paymentIntentId").notEmpty().withMessage("PaymentIntentId is required"),

  handleValidationErrors,
];

export const validateCancelPayment = [
  body("paymentIntentId").notEmpty().withMessage("PaymentIntentId is required"),

  handleValidationErrors,
];
