import Joi from "joi";
import { userSearchErrors } from "../constant/message.constant.js";

export const userSearchSchema = Joi.object({
  currentPage: Joi.number().greater(0).required().messages({
    "any.required": userSearchErrors.CURRENT_PAGE_REQUIRED,
    "number.base": userSearchErrors.CURRENT_PAGE_AS_NUMBER,
    "number.greater": userSearchErrors.CURRENT_PAGE_VALIDATION,
  }),
  totalRecordsPerPage: Joi.number().greater(0).required().messages({
    "any.required": userSearchErrors.PER_PAGE_RECORD_REQUIRED,
    "number.base": userSearchErrors.PER_PAGE_RECORD_AS_NUMBER,
    "number.greater": userSearchErrors.PER_PAGE_RECORD_VALIDATION,
  }),
  searchText: Joi.string().allow("").required().messages({
    "any.required": userSearchErrors.SEARCH_TEXT_REQUIRED,
    "string.base": userSearchErrors.SEARCH_TEXT_AS_STRING,
  }),
});
