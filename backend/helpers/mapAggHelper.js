export const regionRounds = () => {
  return {
    $set: {
      lat: {
        $round: [
          {
            $toDouble: "$lat",
          },
          2,
        ],
      },
      lng: {
        $round: [
          {
            $toDouble: "$lng",
          },
          2,
        ],
      },
    },
  };
};

export const searchAgg = (searchText) => {
  return {
    $match: {
      $or: [
        {
          title: {
            $regex: new RegExp(searchText, "i"),
          },
        },
      ],
    },
  };
};

export const shaping = () => {
  return {
    $project: {
      _id: false,
      title: 1,
      notes: 1,
      mapID: 1,
      mLat: 1,
      mLng: 1,
      zoom: 1,
      lat: 1,
      lng: 1,
    },
  };
};

export const grouping = () => {
  return {
    $group: {
      _id: null,
      count: {
        $sum: 1,
      },
      data: {
        $push: "$$ROOT",
      },
    },
  };
};

export const docSummary = (page, docsPerPage) => {
  return {
    $project: {
      data: {
        $slice: ["$data", docsPerPage * (page - 1), docsPerPage],
      },
      totalRecords: { $size: "$data" },
      _id: false,
    },
  };
};
