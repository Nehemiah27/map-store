import Joi from "joi";
import userRegex from "../constant/regex.constant.js";
import { userErrors } from "../constant/message.constant.js";

export const userSchema = Joi.object({
  firstName: Joi.string().trim().required().messages({
    "any.required": userErrors.FIRST_NAME_REQUIRED,
    "string.empty": userErrors.FIRST_NAME_EMTPY,
    "string.base": userErrors.FIRST_NAME_STRING,
  }),
  lastName: Joi.string().trim().allow("").optional().messages({
    "string.base": userErrors.LAST_NAME_STRING,
  }),
  email: Joi.string().pattern(userRegex.EMAIL_REGEX).required().messages({
    "any.required": userErrors.EMAIL_REQUIRED,
    "string.empty": userErrors.EMAIL_EMPTY,
    "string.base": userErrors.EMAIL_STRING,
    "string.pattern.base": userErrors.EMAIL_INVALID,
  }),
  password: Joi.string().pattern(userRegex.PASSWORD_REGEX).required().messages({
    "any.required": userErrors.PASSWORD_REQUIRED,
    "string.empty": userErrors.PASSWORD_EMPTY,
    "string.base": userErrors.PASSWORD_STRING,
    "string.pattern.base": userErrors.PASSWORD_INVALID,
  }),
});
