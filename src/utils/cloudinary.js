import dotenv from "dotenv";
dotenv.config();

//cloudinary
import { v2 as cloudinary } from "cloudinary";

//configuracion de cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});


//funcion para carga archivo
export async function uploadFile(filePath) {
  return await cloudinary.uploader.upload(filePath)
}

//funcion para eliminar un archivo
export async function deleteFile(cloudinary_id) {
  return await cloudinary.uploader.destroy(cloudinary_id)
}

export default cloudinary;
