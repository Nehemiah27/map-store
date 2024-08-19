import { errorResponse, successResponse } from "../helpers/responseHelper.js";
import { authErrors } from "../constant/message.constant.js";
import { userAuth, userSessionClose } from "../services/authService.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const authCheck = await userAuth(email, password);
    if (authCheck.code === 200)
      return successResponse(res, authCheck.message, authCheck.data);
    else return errorResponse(res, authCheck.message, authCheck.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, authErrors.AUTH_ERROR, 500, error.stack);
  }
};

export const logoutUser = async (req, res) => {
  const { email } = req.body;
  try {
    const authCheck = await userSessionClose(email);
    if (authCheck.code === 200)
      return successResponse(res, authCheck.message, null);
    else return errorResponse(res, authCheck.message, authCheck.code);
  } catch (error) {
    console.log(error, "error");
    return errorResponse(res, authErrors.AUTH_ERROR, 500, error.stack);
  }
};
