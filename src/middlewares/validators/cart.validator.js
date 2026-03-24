import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: true, data: errors.array() });
  }
  next();
};

export const validateAddToCart = [
  body("productId")
    .notEmpty()
    .withMessage("ProductId is required")
    .isMongoId()
    .withMessage("Invalid productId format"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  handleValidationErrors,
];

export const validateUpdateQuantity = [
  body("productId")
    .notEmpty()
    .withMessage("ProductId is required")
    .isMongoId()
    .withMessage("Invalid productId format"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  handleValidationErrors,
];

export const validateRemoveFromCart = [
  body("productId")
    .notEmpty()
    .withMessage("ProductId is required")
    .isMongoId()
    .withMessage("Invalid productId format"),

  handleValidationErrors,
];
