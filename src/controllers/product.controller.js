import { productService } from "../services/index.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";

//get all products
const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    if (!products || products.length === 0) {
      throw new NotFoundError("Product not found");
    }
    response(res, 200, products);
  } catch (error) {
    next(error);
  }
};

//get product by id
const getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await productService.getBy({ _id: id });
    response(res, 200, product);
  } catch (error) {
    next(error);
  }
};
//create product - mas adelante implementar la carga de imagenes
const createProduct = async (req, res, next) => {
  const { name, description, price, image } = req.body;
  try {
    await productService.insert({
      name,
      description,
      price,
    });
    response(res, 201, "Product created successfully");
  } catch (error) {
    next(error);
  }
};

//update product

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  try {
    if (Object.keys(body).length === 0)
      throw new ClientError("No fields provided for update");
    await productService.update(id, body);
    response(res, 200, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

//delete product
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    await productService.delete(id);
    response(res, 200, "product deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
