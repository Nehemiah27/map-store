import jwt from "jsonwebtoken";
import envCaptured from "../config/envValidation.js";

export const generateToken = (user) => {
  const payload = { userID: user.userID, email: user.email };
  return jwt.sign(payload, envCaptured.jwt.secret);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, envCaptured.jwt.secret, {
      ignoreExpiration: true,
    });
  } catch (error) {
    return null;
  }
};
