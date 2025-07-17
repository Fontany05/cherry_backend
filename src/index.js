import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { resErrors } from "./utils/resErrors.js";
import http from "http";
import morgan from "morgan";
import helmet from "helmet";
import apiRouter from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Configuración de middlewares

app.use(
  cors({
    origin: 'http://localhost:4200',
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(helmet());

// Rutas
apiRouter(app);

// Manejo de errores con middlewares
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  resErrors(res, statusCode, message);
});

// Creación del servidor
const server = http.createServer(app);

// Levanta el servidor
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
