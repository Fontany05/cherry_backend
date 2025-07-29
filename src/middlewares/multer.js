import multer from "multer";
import path from "path";

//se configura donde se sube la imagen,su nombre y se trae su extension
const storage = multer.diskStorage({
  destination: path.join(import.meta.dirname, "../../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
//filtro para aceptar archivos jpg, png
const filter = (req, file, cb) => {
  const allowedImageTypes = ["image/jpeg", "image/png"];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filter,
});

export default upload;
