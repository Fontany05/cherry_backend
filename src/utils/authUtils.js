import jwt from "jsonwebtoken";
import config from "../config/config.js";

// 1. Centralizamos la configuración
export const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
});

// 2. Usamos esa configuración para crear
export const sendTokens = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    config.secret,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    config.refreshSecret,
    { expiresIn: "7d" }
  );

  const options = getCookieOptions();

  res.cookie("access_token", token, { ...options, maxAge: 3600000 }); // 1h
  res.cookie("refresh_token", refreshToken, { ...options, maxAge: 604800000 }); // 7d

  return token;
};