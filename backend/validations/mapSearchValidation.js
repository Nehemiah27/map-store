import Joi from "joi";
import { mapSearchErrors } from "../constant/message.constant.js";

export const mapSearchSchema = Joi.object({
  currentPage: Joi.number().greater(0).required().messages({
    "any.required": mapSearchErrors.CURRENT_PAGE_REQUIRED,
    "number.base": mapSearchErrors.CURRENT_PAGE_AS_NUMBER,
    "number.greater": mapSearchErrors.CURRENT_PAGE_VALIDATION,
  }),
  totalRecordsPerPage: Joi.number().greater(0).required().messages({
    "any.required": mapSearchErrors.PER_PAGE_RECORD_REQUIRED,
    "number.base": mapSearchErrors.PER_PAGE_RECORD_AS_NUMBER,
    "number.greater": mapSearchErrors.PER_PAGE_RECORD_VALIDATION,
  }),
  searchText: Joi.string().allow("").required().messages({
    "any.required": mapSearchErrors.SEARCH_TEXT_REQUIRED,
    "string.base": mapSearchErrors.SEARCH_TEXT_AS_STRING,
  }),
});
