import Joi from "joi";
import userRegex from "../constant/regex.constant.js";
import { passwordChangeErrors } from "../constant/message.constant.js";

export const passwordChangeSchema = Joi.object({
  userID: Joi.string().trim().required().messages({
    "any.required": passwordChangeErrors.USERID_REQUIRED,
    "string.empty": passwordChangeErrors.USERID_EMPTY,
    "string.base": passwordChangeErrors.USERID_STRING,
  }),
  oldPassword: Joi.string()
    .pattern(userRegex.PASSWORD_REGEX)
    .required()
    .messages({
      "any.required": passwordChangeErrors.OLD_PASSWORD_REQUIRED,
      "string.empty": passwordChangeErrors.OLD_PASSWORD_EMPTY,
      "string.base": passwordChangeErrors.OLD_PASSWORD_STRING,
      "string.pattern.base": passwordChangeErrors.OLD_PASSWORD_INVALID,
    }),
  newPassword: Joi.string()
    .pattern(userRegex.PASSWORD_REGEX)
    .required()
    .messages({
      "any.required": passwordChangeErrors.NEW_PASSWORD_REQUIRED,
      "string.empty": passwordChangeErrors.NEW_PASSWORD_EMPTY,
      "string.base": passwordChangeErrors.NEW_PASSWORD_STRING,
      "string.pattern.base": passwordChangeErrors.NEW_PASSWORD_INVALID,
    }),
});
