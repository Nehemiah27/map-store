import Joi from "joi";
import { cuboidErrors } from "../constant/message.constant.js";

export const cuboidSchema = Joi.object({
  mapID: Joi.string().trim().required().messages({
    "any.required": cuboidErrors.MAPID_REQUIRED,
    "string.empty": cuboidErrors.MAPID_EMPTY,
    "string.base": cuboidErrors.MAPID_STRING,
  }),
});
