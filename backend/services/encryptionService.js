import bcrypt from "bcrypt";
import { ENCRYPTION_SALT_ROUNDS } from "../constant/variable.constant.js";
import { serverErrors } from "../constant/message.constant.js";

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(ENCRYPTION_SALT_ROUNDS),
      hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(serverErrors.ERROR_HASHING_PASSWORD);
  }
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(serverErrors.ERROR_HASH_COMPARE);
  }
};
