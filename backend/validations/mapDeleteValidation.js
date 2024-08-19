import Joi from "joi";
import { mapDeleteErrors } from "../constant/message.constant.js";

export const mapDeleteSchema = Joi.object({
  mapID: Joi.string().trim().required().messages({
    "any.required": mapDeleteErrors.MAPID_REQUIRED,
    "string.empty": mapDeleteErrors.MAPID_STRING,
    "string.base": mapDeleteErrors.MAPID_STRING,
  }),
});
