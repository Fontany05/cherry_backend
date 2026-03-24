import { userService } from "../services/index.js";
import { response } from "../utils/response.js";

// Obtener perfil del usuario logueado
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getBy({ _id: userId });

    response(res, 200, {
      fullName: user.fullName,
      email: user.email,
      address: user.address,
      telephone: user.telephone,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
};