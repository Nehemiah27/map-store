import Joi from "joi";
import { mapCaptureErrors } from "../constant/message.constant.js";

export const mapCaptureSchema = Joi.object({
  userID: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.USERID_REQUIRED,
    "string.empty": mapCaptureErrors.USERID_EMPTY,
    "string.base": mapCaptureErrors.USERID_STRING,
  }),
  lat: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.LAT_REQUIRED,
    "string.empty": mapCaptureErrors.LAT_EMPTY,
    "string.base": mapCaptureErrors.LAT_STRING,
  }),
  lng: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.LNG_REQUIRED,
    "string.empty": mapCaptureErrors.LNG_EMPTY,
    "string.base": mapCaptureErrors.LNG_STRING,
  }),
  mLat: Joi.string().trim().allow(null).optional(),
  mLng: Joi.string().trim().allow(null).optional(),
  zoom: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.ZOOM_REQUIRED,
    "string.empty": mapCaptureErrors.ZOOM_EMPTY,
    "string.base": mapCaptureErrors.ZOOM_STRING,
  }),
  title: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.TITLE_REQUIRED,
    "string.empty": mapCaptureErrors.TITLE_EMPTY,
    "string.base": mapCaptureErrors.TITLE_STRING,
  }),
  notes: Joi.string().trim().allow("").required().messages({
    "any.required": mapCaptureErrors.NOTES_REQUIRED,
    "string.base": mapCaptureErrors.NOTES_STRING,
  }),
  mapImage: Joi.string().trim().required().messages({
    "any.required": mapCaptureErrors.MAP_IMAGE_REQUIRED,
    "string.empty": mapCaptureErrors.MAP_IMAGE_EMPTY,
    "string.base": mapCaptureErrors.MAP_IMAGE_STRING,
  }),
});
