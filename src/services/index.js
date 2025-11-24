import Dao from "../database/models/Dao.js";
import UserService from "./user.service.js"
import ProductService from "./product.service.js";
import OrderService from "./order.service.js"
import CartService from "./cart.service.js";
import config from "../config/config.js";


// Crea una nueva instancia Dao utilizando la configuración de conexión a la base de datos.
const dao = new Dao(config.dbUri);


// Crea una nueva instancia del servicio, pasando el DAO como parámetro.
export const userService = new UserService(dao);
export const productService = new ProductService(dao);
export const orderService = new OrderService(dao);
export const cartService = new CartService(dao);


