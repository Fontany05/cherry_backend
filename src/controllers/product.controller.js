import { productService } from "../services/index.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";
//funciones de cloudinary
import { uploadFile, deleteFile } from "../utils/cloudinary.js";
//fs o fs-extra,paquete para manejar archivos
import fs from "fs-extra";

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
  const { name, description, price, brand, stock, categories } = req.body;
  try {
    const result = await uploadFile(req.file.path);
    await productService.insert({
      name,
      description,
      price,
      brand,
      stock,
      image: result.url,
      cloudinary_id: result.public_id,
      categories,
    });
    //una vez que se carga la imagen, la elimina de la carpeta de upload dentro del proyecto
    await fs.unlink(req.file.path);
    response(res, 201, "Product created successfully");
  } catch (error) {
    next(error);
  }
};

//update product

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  const media = req.file;
  try {
    if (Object.keys(body).length === 0)
      throw new ClientError("No fields provided for update");

    const datafile = await productService.getBy({ _id: id });
    if (!datafile) throw new NotFoundError("product not found", 404);
    //actualiza  los datos del producto
    await productService.update(id, body);
    //chequea si existe un file/image y si encuenta resultado, lo borra
    if (media) {
      await deleteFile(datafile.cloudinary_id);
      const newData = await uploadFile(media.path);
      const data = {
        image: newData.secure_url,
        cloudinary_id: newData.public_id,
      };
      await productService.update(dataFile, data);
      await fs.unlink(media.path);
    }

    response(res, 200, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

//delete product
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const data = await productService.getBy({ _id: id });
    await productService.delete(id);

    if (data.image && data.cloudinary_id) {
      await deleteFile(data.cloudinary_id);
    }
    await productService.delete(id)
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
