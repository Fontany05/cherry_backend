import { userService } from "../services/index.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { response } from "../utils/response.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { sendTokens, getCookieOptions } from "../utils/authUtils.js";

const secret = config.secret;
const refreshSecret = config.refreshSecret;

//signup
const signup = async (req, res, next) => {
  const { fullName, email, telephone, password } = req.body;
  try {
    const hashedPassword = await createHash(password);
    const newUser = await userService.insert({
      fullName,
      email,
      telephone,
      password: hashedPassword,
      role: "user",
    });
    const token = sendTokens(res, newUser);

    return response(res, 200, { newUser, token });
  } catch (error) {
    next(error);
  }
};

//logOut
const logout = async (req, res, next) => {
  try {
    // Obtenemos la configuración base (mismo path, sameSite y secure que al crearla)
    const options = getCookieOptions();

    // Borramos las cookies enviando exactamente las mismas opciones
    res.clearCookie("access_token", options);
    res.clearCookie("refresh_token", options);

    return response(res, 200, { message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Verificar si los campos requeridos están presentes
    if (!email || !password) {
      return response(res, 400, "Incomplete fields");
    }

    // Buscar usuario por email
    const userFound = await userService.getBy({ email });
    if (!userFound) {
      return response(res, 404, "User not found");
    }

    // Validar contraseña
    const matchPass = await isValidPassword(userFound, password);
    if (!matchPass) {
      return res.status(401).json({ token: null, msj: "Invalid password" });
    }

    const token = sendTokens(res, userFound);
    return response(res, 200, { token });
  } catch (error) {
    next(error);
  }
};

//refresh token
const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) return response(res, 401, "No refresh token");

  try {
    // Usamos el secret de refresh que ya tienes en config
    const decoded = jwt.verify(refreshToken, refreshSecret);

    // IMPORTANTE: pasamos el objeto decodificado a sendTokens
    // para que regenere ambos tokens y refresque las cookies
    const token = sendTokens(res, decoded);

    return response(res, 200, { message: "Access token refreshed", token });
  } catch (err) {
    return response(res, 403, "Invalid or expired refresh token");
  }
};

const me = async (req, res, next) => {
  try {
    return response(res, 200, {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  signup,
  logout,
  signin,
  refresh,
  me,
};
