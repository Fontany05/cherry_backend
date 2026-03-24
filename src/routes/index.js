import express from "express";
import bodyParser from "body-parser";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import paymentRouter from "./payment.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";
import userRouter from "./user.routes.js";

const app = express();

// Configuración del Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = (app) => {
  const router = express.Router();
  router.use("/api/auth", authRouter);
  router.use("/api/products", productRouter);
  router.use("/api/payments", paymentRouter);
  router.use("/api/carts", cartRouter);
  router.use("/api/orders", orderRouter);
  router.use("/api/users", userRouter);

  app.use(router);
};

export default apiRouter;
