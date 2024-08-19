import {
  mapCaptureErrors,
  mapDeleteErrors,
  mapEditErrors,
  topMapErrors,
  cuboidErrors,
  mapSearchErrors,
  noteEditErrors,
} from "../constant/message.constant.js";
import {
  mapStore,
  deleteMap,
  savedMapEdit,
  topThree,
  cuboidImage,
  noteEdit,
  mapHomeView,
  mapTitle,
  mapResults,
  fullMapView,
} from "../services/mapService.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";

export const mapTitleCheck = async (req, res) => {
  try {
    const mapMeta = await mapTitle(req.body);
    if (mapMeta.code === 200)
      return successResponse(res, mapMeta.message, null);
    else return errorResponse(res, mapMeta.message, mapMeta.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapCaptureErrors.MAP_ERROR, 500, error.stack);
  }
};

export const mapCapture = async (req, res) => {
  try {
    const mapMeta = await mapStore(req.body);
    if (mapMeta.code === 200)
      return successResponse(res, mapMeta.message, null);
    else return errorResponse(res, mapMeta.message, mapMeta.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapCaptureErrors.MAP_ERROR, 500, error.stack);
  }
};

export const mapEdit = async (req, res) => {
  try {
    const mapMeta = await savedMapEdit(req.body);
    if (mapMeta.code === 200)
      return successResponse(res, mapMeta.message, null);
    else return errorResponse(res, mapMeta.message, mapMeta.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapEditErrors.MAP_ERROR, 500, error.stack);
  }
};

export const mapDelete = async (req, res) => {
  const { mapID } = req.body;
  try {
    const mapDeleteStatus = await deleteMap(mapID);
    return successResponse(res, mapDeleteStatus.message, null);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapDeleteErrors.MAP_ERROR, 500, error.stack);
  }
};

export const mapHome = async (req, res) => {
  const { userID } = req.body;
  try {
    const mapViewStatus = await mapHomeView(userID);
    return successResponse(res, mapViewStatus.message, mapViewStatus.data);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapDeleteErrors.MAP_ERROR, 500, error.stack);
  }
};

export const topThreeViews = async (req, res) => {
  try {
    const threeResults = await topThree();
    return successResponse(res, threeResults.message, threeResults.data);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, topMapErrors.MAP_ERROR, 500, error.stack);
  }
};

export const cuboidView = async (req, res) => {
  const { mapID } = req.body;
  try {
    const cuboidResult = await cuboidImage(mapID);
    if (cuboidResult.code === 200)
      return successResponse(res, cuboidResult.message, cuboidResult.data);
    else return errorResponse(res, cuboidResult.message, cuboidErrors.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, cuboidErrors.MAP_ERROR, 500, error.stack);
  }
};

export const editNotes = async (req, res) => {
  try {
    const notesStatus = await noteEdit(req.body);
    if (notesStatus.code === 200)
      return successResponse(res, notesStatus.message, notesStatus.data);
    else errorResponse(res, notesStatus.message, notesStatus.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, noteEditErrors.MAP_ERROR, 500, error.stack);
  }
};

export const mapSearch = async (req, res) => {
  try {
    const searchResults = await mapResults(req.body);
    return successResponse(res, searchResults.message, searchResults.data);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapSearchErrors.MAP_ERROR, 500, error.stack);
  }
};

export const fullMap = async (req, res) => {
  const { mapID } = req.body;
  try {
    const mapData = await fullMapView(mapID);
    return successResponse(res, mapData.message, mapData.data);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, mapSearchErrors.MAP_ERROR, 500, error.stack);
  }
};
