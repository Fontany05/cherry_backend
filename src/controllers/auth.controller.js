import { userService } from "../services/index.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secret = config.secret;
const refreshSecret = config.refreshSecret;

//signup
const signup = async (req, res, next) => {
  const { fullName, email,telephone, password } = req.body;
  try {
    const hashedPassword = await createHash(password);
    const newUser = await userService.insert({
      fullName,
      email,
      telephone,
      password: hashedPassword,
      role: "user",
    });
     // Generar token JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email },
      secret,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });

    const refreshToken = jwt.sign({ id: newUser._id }, refreshSecret, {
      expiresIn: "7d",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    return response(res, 200, { newUser, token });
  } catch (error) {
    next(error);
  }
};

//logOut
const logout = async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return response(res, 200, "Logged out successfully");
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

     // Generar token JWT
    const token = jwt.sign(
      { id: userFound._id, role: userFound.role, email: userFound.email },
      secret,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });

    const refreshToken = jwt.sign({ id: userFound._id, role: userFound.role, email: userFound.email }, 
      refreshSecret, {
      expiresIn: "7d",
    });

    // Enviar el refresh token en cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
    });

    return response(res, 200, { token });
  } catch (error) {
    next(error);
  }
};

//refresh token
const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    return response(res, 401, "No refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);
    const userId = decoded.id;

    // Opcionalmente verificar que el usuario exista en la base de datos aquí

    // Crear nuevo access token
    const newAccessToken = jwt.sign({ id: userId }, secret, {
      expiresIn: "1h",
    });

    // Enviar nuevo access token en cookie
    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, //1 hora
    });

    return response(res, { message: "Access token refreshed" });
  } catch (err) {
    return response(res, 403, "Invalid or expired refresh token");
  }
};

export default {
  signup,
  logout,
  signin,
  refresh,
};
