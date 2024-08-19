import User from "../models/users.js";
import { v4 as uuid } from "uuid";
import { hashPassword, comparePassword } from "./encryptionService.js";
import {
  userSearchResponses,
  passwordChangeErrors,
  userResponses,
} from "../constant/message.constant.js";
import {
  searchAgg,
  shaping,
  grouping,
  docSummary,
} from "../helpers/usersAggHelper.js";

export const checkUserDB = async () => {
  const configCheck = await User.exists({});
  return configCheck;
};

export const isEmailUnique = async (email) => {
  const user = await User.find({
    email,
  }).lean();
  if (user && user.length) return false;
  return true;
};

export const createNewUser = async (userNames, email, password) => {
  await User.create({
    ...userNames,
    email,
    password: await hashPassword(password),
    isEmailSent: false,
    pending: false,
    userID: uuid(),
  });
};

export const userResults = async (tableInfo) => {
  const { searchText, currentPage, totalRecordsPerPage } = tableInfo,
    searchResults = await User.aggregate([
      searchAgg(searchText),
      shaping(),
      grouping(),
      docSummary(currentPage, totalRecordsPerPage),
    ]);
  return {
    data: searchResults.length
      ? searchResults[0]
      : { data: [], totalRecords: 0 },
    message: userSearchResponses.RESULTS_FETCH,
  };
};

export const passwordChange = async (userInfo) => {
  const { userID, oldPassword, newPassword } = userInfo,
    user = await User.findOne({ userID });
  if (!user) return { code: 404, message: passwordChangeErrors.USER_NOT_FOUND };
  if (!(await comparePassword(oldPassword, user.password)))
    return { code: 409, message: passwordChangeErrors.INVALID_OLD_PASSWORD };
  await User.findOneAndUpdate(
    { userID },
    {
      password: await hashPassword(newPassword),
    }
  );
  return { code: 200, message: userResponses.PASSWORD_CHANGE_SUCCESS };
};
