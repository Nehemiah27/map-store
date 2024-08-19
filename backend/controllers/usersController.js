import {
  userErrors,
  userResponses,
  userSearchErrors,
  passwordChangeErrors,
} from "../constant/message.constant.js";
import {
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_FIRST_NAME,
  DEFAULT_USER_LAST_NAME,
  DEFAULT_USER_PASSWORD,
} from "../constant/variable.constant.js";
import { alignNames } from "../helpers/userHelpers.js";
import { successResponse, errorResponse } from "../helpers/responseHelper.js";
import {
  checkUserDB,
  isEmailUnique,
  createNewUser,
  userResults,
  passwordChange,
} from "../services/userService.js";

export const setDefaultUser = async (req, res, next) => {
  try {
    const configCheck = await checkUserDB();
    if (configCheck)
      return errorResponse(
        res,
        userErrors.DEFAULTS_ALREADY_CONFIGURED,
        422,
        ""
      );
    await createUser({
      email: DEFAULT_USER_EMAIL,
      firstName: DEFAULT_USER_FIRST_NAME,
      lastName: DEFAULT_USER_LAST_NAME,
      password: DEFAULT_USER_PASSWORD,
    });
    return successResponse(res, userResponses.DEFAULT_USER_SUCCESS);
  } catch (error) {
    return errorResponse(res, error.message, 500, error.stack);
  }
};

export const createUserController = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    if (user.code === 200)
      return successResponse(res, userResponses.USER_CREATE_SUCCESS);
    else return errorResponse(res, userErrors.DUPLICATE_USER, 409);
  } catch (error) {
    next(error);
  }
};

export const usersSearch = async (req, res) => {
  try {
    const searchResults = await userResults(req.body);
    return successResponse(res, searchResults.message, searchResults.data);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, userSearchErrors.USERS_ERROR, 500, error.stack);
  }
};

export const changePassword = async (req, res) => {
  try {
    const changeStatus = await passwordChange(req.body);
    if (changeStatus.code === 200)
      return successResponse(res, changeStatus.message);
    else return errorResponse(res, changeStatus.message, changeStatus.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(
      res,
      passwordChangeErrors.PASSWORD_CHANGE_ERROR,
      500,
      error.stack
    );
  }
};

const createUser = async (userInfo) => {
  const { firstName, lastName, password } = userInfo,
    email = userInfo.email.toLowerCase(),
    uniqueStatus = await isEmailUnique(email);
  if (!uniqueStatus)
    return { code: 409, message: userErrors.DUPLICATE_USER, success: false };
  const userNames = alignNames(firstName, lastName);
  await createNewUser(userNames, email, password);
  return {
    code: 200,
    message: userResponses.USER_CREATE_SUCCESS,
    success: false,
  };
};
