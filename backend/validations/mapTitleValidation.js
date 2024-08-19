import Joi from "joi";
import { mapTitleErrors } from "../constant/message.constant.js";

export const mapTitleSchema = Joi.object({
  userID: Joi.string().trim().required().messages({
    "any.required": mapTitleErrors.USERID_REQUIRED,
    "string.empty": mapTitleErrors.USERID_EMPTY,
    "string.base": mapTitleErrors.USERID_STRING,
  }),
  title: Joi.string().trim().required().messages({
    "any.required": mapTitleErrors.TITLE_REQUIRED,
    "string.empty": mapTitleErrors.TITLE_EMPTY,
    "string.base": mapTitleErrors.TITLE_STRING,
  }),
});
