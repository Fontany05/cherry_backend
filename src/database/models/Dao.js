import mongoose from "mongoose";
import User from "./user.model.js"
import Product from "./product.model.js";
import Order from "./order.model.js";
import Cart from "./cart.model.js";


export default class Dao {
  // Primero, creamos el constructor que manejará la conexión a la base de datos.
  constructor(mongoConfig) {
    // Crea una conexión a la base de datos utilizando la URL proporcionada en mongoConfig
    this.mongoose = mongoose.connect(mongoConfig).catch((error) => {
      console.error("Error connecting to database:", error);
      process.exit(); // Finaliza el proceso si la conexión falla.
    });
    // Declaramos los timestamps manualmente
    const options = {
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
      versionKey: false,
    };
    // Creamos una variable para instanciar los schemas, asociando el schema correspondiente con los timestamps.
    const userSchema = mongoose.Schema(User.schema, options);
    const productSchema = mongoose.Schema(Product.schema, options);
    const orderSchema = mongoose.Schema(Order.schema, options);
    const cartSchema = mongoose.Schema(Cart.schema, options);
 
   
    this.models = {
      [User.model]: mongoose.model(User.model, userSchema),
      [Product.model]: mongoose.model(Product.model, productSchema),
      [Order.model]: mongoose.model(Order.model, orderSchema),
      [Cart.model]: mongoose.model(Cart.model, cartSchema),
    };
  }
  // Método para encontrar un único documento que coincida con los criterios especificados.
  // La función recibe dos parámetros:
  // - "options": los criterios de búsqueda, como email, nombre, etc.
  // - "entity": el modelo que se utilizará para buscar en la base de datos.
  findOne = async (options, entity) => {
    // Si la entidad no existe en los modelos, se lanza un error.
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].findOne(options);
      return result ? result.toObject() : null;
    } catch (error) {
      console.error("Error finding document:", error);
      return null;
    }
  };

  // Método para obtener todos los documentos que coincidan con los criterios especificados.
  // La función recibe dos parámetros:
  // - "options": los criterios de búsqueda.
  // - "entity": el modelo que se utilizará para obtener los documentos.
  getAll = async (options, entity) => {
    // Si la entidad no existe en los modelos, se lanza un error.
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    // Utilizamos un bloque try/catch para manejar posibles errores durante la inserción.
    try {
      let results = await this.models[entity].find(options);
      return results.map((result) => result.toObject());
    } catch (error) {
      // En caso de error durante la obtención de documentos, se muestra el error en la consola y se devuelve una lista vacía.
      console.error("Error finding document:", error);
      return [];
    }
  };

  // Método para agregar un nuevo documento a la base de datos.
  // Esta función permite crear y almacenar un nuevo registro para una entidad específica.
  // Recibe dos parámetros:
  // - "document": un objeto JSON que contiene los datos que se desean guardar en la base de datos.
  //   Este objeto incluye los campos y valores específicos necesarios para la entidad, como nombre, contraseña, email, etc.
  // - "entity": el nombre del modelo en el que se insertará el nuevo documento.
  save = async (document, entity) => {
    // Si la entidad no existe en los modelos, se lanza un error.
    if (!this.models[entity]) throw new Error("Entity not found in models");
    // Utilizamos un bloque try/catch para manejar posibles errores durante la inserción.
    try {
      // Creamos una instancia del modelo correspondiente usando el documento proporcionado.
      // Esto genera una nueva instancia del modelo (como newProduct, newCart, newUser)
      // a partir del documento JSON enviado.
      let instance = new this.models[entity](document);

      // Guardamos la instancia en la base de datos.
      let result = await instance.save();

      // Si la inserción fue exitosa, devolvemos el resultado como un objeto plano.
      // Si hubo un problema, devolvemos null.
      return result ? result.toObject() : null;
    } catch (error) {
      // En caso de error, se muestra el error en la consola y se devuelve null.
      console.error("Error saving document:", error);
      return null;
    }
  };

  // Método para guardar múltiples documentos en la base de datos.
  // La función recibe dos parámetros:
  // - "documents": un arreglo de objetos que representan los documentos a insertar en la base de datos.
  // - "entity": el nombre del modelo que se utilizará para realizar la inserción.
  //
  // Este método realiza los siguientes pasos:
  // 1. Verifica que el modelo especificado en "entity" exista en los esquemas del DAO.
  // 2. Usa `insertMany` para insertar todos los documentos proporcionados en la base de datos.
  // 3. Devuelve un arreglo de los documentos insertados, convertidos a objetos planos. Si ocurrió un error durante el proceso,
  //    se captura la excepción y se imprime en la consola, y la función devuelve `null` para indicar que no se pudieron guardar los documentos.
  saveMany = async (documents, entity) => {
    if (!this.models[entity]) throw new Error("Entity not found in models");
    try {
      let result = await this.models[entity].insertMany(documents);
      return result ? result.map((doc) => doc.toObject()) : null;
    } catch (error) {
      console.error("Error saving documents:", error);
      return null;
    }
  };

  // Método para actualizar un documento existente en la base de datos.
  // La función recibe dos parámetros:
  // - "document": el documento que contiene los datos a actualizar. Debe incluir el _id del documento a actualizar.
  // - "entity": el modelo que se utilizará para realizar la actualización.
  // Primero, eliminamos el _id del documento antes de actualizar.
  // Si la entidad no existe en los modelos, se lanza un error.
  // Se actualiza el documento en la base de datos y se devuelve el resultado como un objeto plano.
  update = async (document, entity) => {
    // Si la entidad no existe en los modelos, se lanza un error.
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    let id = document._id;
    delete document._id;
    // Utilizamos un bloque try/catch para manejar posibles errores durante la inserción.
    try {
      // Actualiza el documento con el _id especificado y los datos proporcionados en "document".
      let result = await this.models[entity].findByIdAndUpdate(
        id,
        { $set: document },
        { new: true }
      );
      // Devuelve el resultado actualizado como un objeto plano.
      return result ? result.toObject() : null;
    } catch (error) {
      // En caso de error durante la actualización, se muestra el error en la consola y se devuelve null.
      console.error("Error finding document:", error);
      return null;
    }
  };

  // Método para eliminar un documento existente en la base de datos.
  // La función recibe dos parámetros:
  // - "id": el identificador del documento que se desea eliminar.
  // - "entity": el modelo que se utilizará para realizar la eliminación.
  // Si la entidad no existe en los modelos, se lanza un error.
  // Se busca y elimina el documento en la base de datos usando el _id proporcionado.
  // Si el documento es encontrado y eliminado, se devuelve el resultado como un objeto plano.
  // Si no se encuentra el documento, se devuelve null.
  delete = async (id, entity) => {
    // Si la entidad no existe en los modelos, se lanza un error.
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);

    // Busca el documento por su _id y lo elimina de la base de datos.
    let result = await this.models[entity].findByIdAndDelete(id);

    // Devuelve el resultado eliminado como un objeto plano o null si no se encuentra el documento.
    return result ? result.toObject() : null;
  };

  // Método para eliminar múltiples documentos de la base de datos.
  // La función recibe dos parámetros:
  // - "filter": un objeto que define las condiciones de búsqueda para encontrar los documentos a eliminar.
  // - "entity": el nombre del modelo que se utilizará para realizar la eliminación.
  //
  // Este método realiza los siguientes pasos:
  // 1. Verifica que el modelo especificado en "entity" exista en los esquemas del DAO.
  // 2. Usa `deleteMany` con el filtro proporcionado para encontrar y eliminar todos los documentos que coincidan con las condiciones.
  // 3. Devuelve el número de documentos eliminados. Si ocurrió un error durante el proceso, se captura la excepción y se imprime en la consola,
  //    y la función devuelve `null` para indicar que no se pudo realizar la eliminación.
  deleteMany = async (filter, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      // Elimina todos los documentos que coincidan con el filtro especificado
      let result = await this.models[entity].deleteMany(filter);
      return result ? result.deletedCount : null;
    } catch (error) {
      console.error("Error finding document:", error);
      return null;
    }
  };
}
