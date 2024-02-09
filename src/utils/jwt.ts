import jwt from "jsonwebtoken";

export const generateToken = (data: Object, secret: string) => {
  return jwt.sign(data, secret, { expiresIn: "15m" });
};
