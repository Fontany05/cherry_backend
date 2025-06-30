import mongoose from "mongoose";

let Schema = mongoose.Schema;

export default class Product {
    constructor(data) {
        this.data = data;
      }
      static get model(){
        return "Products";
      }
      static get schema() {
        return {
            name: {
                type: String,
                required: true,
              },
              description: {
                type: String,
                required: true,
                unique: true,
              },
              price: {
                type: Number,
                required: true,
              },
              image: {
                type: String,
                required: false,
              },
              cloudinary_id: {
                type: String,
                required: false,
              },
              category_id: {
                type: Schema.Types.ObjectId, ref: "Categories", required: false 
              },

            
        }
      }

}