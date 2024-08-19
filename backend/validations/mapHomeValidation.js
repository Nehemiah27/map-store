import Joi from "joi";
import { mapHomeErrors } from "../constant/message.constant.js";

export const mapHomeSchema = Joi.object({
  userID: Joi.string().trim().required().messages({
    "any.required": mapHomeErrors.USERID_REQUIRED,
    "string.empty": mapHomeErrors.USERID_EMPTY,
    "string.base": mapHomeErrors.USERID_STRING,
  }),
});
