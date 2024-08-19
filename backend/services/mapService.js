import MapMeta from "../models/mapMeta.js";
import {
  mapCaptureErrors,
  mapRespones,
  mapDeleteReponses,
  mapEditErrors,
  mapEditRespones,
  mapHomeResponses,
  topMapResponses,
  cuboidErrors,
  cuboidResponses,
  noteEditErrors,
  noteEditResponses,
  mapTitleErrors,
  mapSearchResponses,
  mapTitleRespones,
  fullMapErrors,
  fullViewRespones,
} from "../constant/message.constant.js";
import {
  regionRounds,
  searchAgg,
  shaping,
  grouping,
  docSummary,
} from "../helpers/mapAggHelper.js";
import { v4 as uuid } from "uuid";
import MapImage from "../models/mapImage.js";
import { setCacheWithTTL, getCache } from "../config/cacheManager.js";

export const mapTitle = async (mapMeta) => {
  const { title, userID } = mapMeta,
    existingMap = await MapMeta.findOne({
      title: new RegExp(`^${title}$`, "i"),
      userID,
    });
  if (existingMap)
    return { code: 409, message: mapTitleErrors.DUPLICATE_TITLE };
  return { code: 200, message: mapTitleRespones.TITLE_UNIQUE };
};

export const mapStore = async (mapMeta) => {
  const { title, userID } = mapMeta,
    existingMap = await MapMeta.findOne({
      title: new RegExp(`^${title}$`, "i"),
      userID,
    });
  if (existingMap)
    return { code: 409, message: mapCaptureErrors.DUPLICATE_TITLE };
  const { mapImage, ...mapInfo } = mapMeta,
    mapID = uuid();
  await MapMeta.insertMany({
    ...mapInfo,
    mapID,
  });
  await MapImage.insertMany({
    mapImage,
    mapID,
    userID: mapMeta.userID,
    accessCount: 1,
  });
  await updateFrequentCache(mapMeta.userID);
  return { code: 200, message: mapRespones.CAPTURE_SUCCESS };
};

export const savedMapEdit = async (mapMeta) => {
  const { title, mapID } = mapMeta,
    existingMap = await MapMeta.findOne({
      title: new RegExp(`^${title}$`, "i"),
      mapID: { $ne: mapID },
    });
  if (existingMap) return { code: 409, message: mapEditErrors.DUPLICATE_TITLE };
  const countCheck = await MapImage.findOne({ mapID }),
    { mapImage, ...mapInfo } = mapMeta;
  await MapMeta.findOneAndUpdate(
    {
      mapID,
    },
    { ...mapInfo },
    {
      upsert: true,
    }
  );
  await MapImage.findOneAndUpdate(
    {
      mapID,
    },
    {
      mapImage,
      userID: mapMeta.userID,
      mapID,
      accessCount: countCheck ? countCheck.accessCount + 1 : 1,
    },
    {
      upsert: true,
    }
  );
  await updateFrequentCache(mapMeta.userID);
  return { code: 200, message: mapEditRespones.MAP_EDIT_SUCCESS };
};

export const deleteMap = async (mapID) => {
  await MapMeta.findOneAndDelete({
    mapID,
  });
  await MapImage.findOneAndDelete({
    mapID,
  });
  await updateFrequentCache(mapID);
  return { code: 200, message: mapDeleteReponses.MAP_DELETE_SUCCESS };
};

export const mapHomeView = async (userID) => {
  const frequentChart = await getCache(`${userID}`);
  if (frequentChart !== null)
    return {
      message: mapHomeResponses.MAP_FETCH,
      data: JSON.parse(frequentChart),
    };
  const chartUpdate = await updateFrequentCache(userID);
  if (chartUpdate === "")
    return { message: mapHomeResponses.MAP_FETCH, data: {} };
  return { message: mapHomeResponses.MAP_FETCH, data: JSON.parse(chartUpdate) };
};

export const topThree = async () => {
  const results = await MapMeta.aggregate([
    regionRounds(),
    {
      $group: {
        _id: {
          lat: "$lat",
          lng: "$lng",
          zoom: "$zoom",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 3,
    },
  ]);
  return { message: topMapResponses.FREQUENT_FETCH, data: results };
};

export const cuboidImage = async (mapID) => {
  const cuboid = await MapImage.findOne({ mapID });
  if (cuboid) {
    await MapImage.findOneAndUpdate(
      { mapID },
      { accessCount: cuboid.accessCount + 1 }
    );
    await updateFrequentCache(cuboid.userID);
    return {
      code: 200,
      data: cuboid.mapImage,
      message: cuboidResponses.MAP_FETCH_SUCCESS,
    };
  }
  return { code: 404, message: cuboidErrors.MAP_NOT_FOUND };
};

export const fullMapView = async (mapID) => {
  const mapData = await MapImage.findOne({ mapID });
  if (!mapData) return { code: 404, message: fullMapErrors.MAP_NOT_FOUND };
  await MapImage.findOneAndUpdate(
    { mapID },
    { accessCount: mapData.accessCount + 1 }
  );
  await updateFrequentCache(mapData.userID);
  const viewData = await MapMeta.findOne({ mapID }),
    imageData = JSON.parse(JSON.stringify(mapData)),
    meta = JSON.parse(JSON.stringify(viewData));
  return {
    data: { ...meta, ...imageData },
    message: fullViewRespones.MAP_FETCH_SUCCESS,
  };
};

export const noteEdit = async (mapInfo) => {
  const { title, mapID } = mapInfo,
    existingMap = await MapMeta.findOne({
      title: new RegExp(`^${title}$`, "i"),
      mapID: { $ne: mapID },
    });
  if (existingMap)
    return { code: 409, message: noteEditErrors.DUPLICATE_TITLE };
  await MapMeta.findOneAndUpdate(
    {
      mapID,
    },
    { ...mapInfo }
  );
  const userID = await MapMeta.findOne({ mapID });
  await updateFrequentCache(userID.userID);
  return { code: 200, message: noteEditResponses.ANNOTATION_EDIT_SUCCESS };
};

export const mapResults = async (tableView) => {
  const { searchText, currentPage, totalRecordsPerPage } = tableView,
    searchResults = await MapMeta.aggregate([
      searchAgg(searchText),
      shaping(),
      grouping(),
      docSummary(currentPage, totalRecordsPerPage),
    ]);
  return {
    data: searchResults.length
      ? searchResults[0]
      : { data: [], totalRecords: 0 },
    message: mapSearchResponses.RESULTS_FETCH,
  };
};

const updateFrequentCache = async (userID) => {
  const freqDoc = await MapImage.aggregate([
    { $match: { userID: userID } },
    { $sort: { accessCount: -1, updatedAt: -1 } },
    { $limit: 1 },
  ]);
  if (!freqDoc.length) return "";
  const imageMeta = await MapMeta.findOne({
      mapID: freqDoc[0].mapID,
    }),
    updatedDoc = JSON.parse(JSON.stringify(freqDoc[0])),
    updatedMeta = JSON.parse(JSON.stringify(imageMeta));
  const docToStore = { ...updatedDoc, ...updatedMeta },
    frequent = JSON.stringify(docToStore);
  await setCacheWithTTL(`${userID}`, frequent);
  return frequent;
};
