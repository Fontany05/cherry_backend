import Product from "../database/models/product.model.js";
import GenericQueries from "./gerenicQueries.js";
import { buildProductFilter } from "../utils/productFilter.js";

export default class ProductService extends GenericQueries {
  constructor(dao) {
    super(dao, Product.model);
  }

  getFilteredProducts = async (queryParams) => {
    // Construye el filtro basado en los query parameters
    const filter = buildProductFilter(queryParams);

    // Ejecuta la query con el filtro
    const products = await this.dao.models[Product.model].find(filter);

    return products;
  };
}
