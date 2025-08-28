import express from "express";
import productController from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/authJwt.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' })

const router = express.Router();


router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/",verifyToken,upload.single('image'), productController.createProduct);
router.patch("/:id",verifyToken,upload.single('image'), productController.updateProduct);
router.delete("/:id",verifyToken, productController.deleteProduct);


export default router;