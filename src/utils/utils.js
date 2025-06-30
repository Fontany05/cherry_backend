import bcrypt from "bcrypt";
// Asíncrona para crear el hash
export const createHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Asíncrona para validar el password
export const isValidPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};
