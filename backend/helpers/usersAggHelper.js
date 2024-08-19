export const searchAgg = (searchText) => {
  return {
    $match: {
      $or: [
        {
          email: {
            $regex: new RegExp(searchText, "i"),
          },
        },
        {
          fullName: {
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
      fullName: 1,
      email: 1,
      userID: 1,
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
