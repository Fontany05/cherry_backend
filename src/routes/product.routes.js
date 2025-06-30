import express from "express";
import productController from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = express.Router();


router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/",verifyToken, productController.createProduct);
router.patch("/:id",verifyToken, productController.updateProduct);
router.delete("/:id",verifyToken, productController.deleteProduct);



export default router;