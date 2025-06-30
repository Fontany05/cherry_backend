import express from "express";
import bodyParser from "body-parser";
import authRouter from "./auth.routes.js"
import productRouter from "./product.routes.js";



const app = express();

// Configuración del Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const apiRouter = (app) => {
  const router = express.Router();
  router.use("/api/auth", authRouter)
  router.use("/api/products", productRouter);
  
 
  app.use(router);
};

export default apiRouter;
