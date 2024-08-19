import Joi from "joi";
import { noteEditErrors } from "../constant/message.constant.js";

export const editNotesSchema = Joi.object({
  mapID: Joi.string().trim().required().messages({
    "any.required": noteEditErrors.MAPID_REQUIRED,
    "string.empty": noteEditErrors.MAPID_EMPTY,
    "string.base": noteEditErrors.MAPID_STRING,
  }),
  title: Joi.string().trim().required().messages({
    "any.required": noteEditErrors.TITLE_REQUIRED,
    "string.empty": noteEditErrors.TITLE_EMPTY,
    "string.base": noteEditErrors.TITLE_STRING,
  }),
  notes: Joi.string().trim().allow("").required().messages({
    "any.required": noteEditErrors.NOTES_REQUIRED,
    "string.base": noteEditErrors.NOTES_STRING,
  }),
});
