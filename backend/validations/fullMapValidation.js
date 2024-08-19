import Joi from "joi";
import { fullMapErrors } from "../constant/message.constant.js";

export const fullMapSchema = Joi.object({
  mapID: Joi.string().trim().required().messages({
    "any.required": fullMapErrors.MAPID_REQUIRED,
    "string.empty": fullMapErrors.MAPID_EMPTY,
    "string.base": fullMapErrors.MAPID_STRING,
  }),
});
