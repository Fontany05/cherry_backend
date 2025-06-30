import { userService } from "../services/index.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { NotFoundError, ClientError } from "../utils/errors.js";
import { response } from "../utils/response.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const secret = config.secret;

//signup
const signup = async (req, res, next) => {
  const { fullName, email, password, telephone } = req.body;
  try {
    const hashedPassword = await createHash(password);
    const newUser = await userService.insert({
      fullName,
      email,
      password: hashedPassword,
      telephone,
      role: "user",
    });
    //generar token jwt
    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    // Establecer cookie (igual que en signin)
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    return response(res, 200, { newUser, token });
  } catch (error) {
    next(error);
  }
};

//logOut
const logout = async (req, res, next) => {};

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
    return response(res, 200, { token });
  } catch (error) {
    next(error);
  }
};

export default {
  signup,
  logout,
  signin,
};
