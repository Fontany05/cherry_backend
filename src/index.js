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
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, "./docs/swagger.json"), "utf-8"),
);
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Configuración de middlewares

app.use(
  cors({
    origin: [
      "http://localhost:4200",
      "https://cherry-frontend-727x.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(helmet());
//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
