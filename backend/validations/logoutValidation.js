import Joi from "joi";
import { authErrors } from "../constant/message.constant.js";
import userRegex from "../constant/regex.constant.js";

export const logoutSchema = Joi.object({
  email: Joi.string().pattern(userRegex.EMAIL_REGEX).required().messages({
    "any.required": authErrors.EMAIL_REQUIRED,
    "string.empty": authErrors.EMAIL_EMPTY,
    "string.base": authErrors.EMAIL_STRING,
    "string.pattern.base": authErrors.EMAIL_INVALID,
  }),
});
