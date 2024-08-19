import Joi from "joi";
import { mapEditErrors } from "../constant/message.constant.js";

export const mapEditSchema = Joi.object({
  userID: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.USERID_REQUIRED,
    "string.empty": mapEditErrors.USERID_EMPTY,
    "string.base": mapEditErrors.USERID_STRING,
  }),
  mapID: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.MAPID_REQUIRED,
    "string.empty": mapEditErrors.MAPID_EMPTY,
    "string.base": mapEditErrors.MAPID_STRING,
  }),
  lat: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.LAT_REQUIRED,
    "string.empty": mapEditErrors.LAT_EMPTY,
    "string.base": mapEditErrors.LAT_STRING,
  }),
  lng: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.LNG_REQUIRED,
    "string.empty": mapEditErrors.LNG_EMPTY,
    "string.base": mapEditErrors.LNG_STRING,
  }),
  mLat: Joi.string().trim().allow(null).optional(),
  mLng: Joi.string().trim().allow(null).optional(),
  zoom: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.ZOOM_REQUIRED,
    "string.empty": mapEditErrors.ZOOM_EMPTY,
    "string.base": mapEditErrors.ZOOM_STRING,
  }),
  title: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.TITLE_REQUIRED,
    "string.empty": mapEditErrors.TITLE_EMPTY,
    "string.base": mapEditErrors.TITLE_STRING,
  }),
  notes: Joi.string().trim().allow("").required().messages({
    "any.required": mapEditErrors.NOTES_REQUIRED,
    "string.base": mapEditErrors.NOTES_STRING,
  }),
  mapImage: Joi.string().trim().required().messages({
    "any.required": mapEditErrors.MAP_IMAGE_REQUIRED,
    "string.empty": mapEditErrors.MAP_IMAGE_EMPTY,
    "string.base": mapEditErrors.MAP_IMAGE_STRING,
  }),
});
