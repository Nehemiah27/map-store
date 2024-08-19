import User from "../models/users.js";
import { authErrors, authResponses } from "../constant/message.constant.js";
import { comparePassword } from "./encryptionService.js";
import { generateToken } from "../utils/jwtUtils.js";
import { client, setCacheWithTTL, getCache } from "../config/cacheManager.js";
import { TOKEN_EXPIRY_TIME } from "../constant/variable.constant.js";

export const userAuth = async (userEmail, userPassword) => {
  const email = userEmail.toLowerCase(),
    user = await User.findOne({ email }).lean();
  if (!user)
    return {
      code: 404,
      message: authErrors.USER_NOT_FOUND,
    };
  if (user.pending) return { code: 412, message: authErrors.USER_PENDING };
  const compareResult = await comparePassword(userPassword, user.password);
  if (!compareResult)
    return { code: 401, message: authErrors.INVALID_PASSWORD };
  const accessToken = generateToken(user),
    { password, __v, updatedAt, createdAt, _id, ...userData } = user;
  await establishToken(accessToken, email);
  return {
    code: 200,
    data: { ...userData, accessToken },
    message: authResponses.AUTH_SUCCESS,
  };
};

const establishToken = async (accessToken, email) => {
  await client.del(`accessToken_${email}`);
  await client.del(`accessTokenTime_${email}`);
  await setCacheWithTTL(`accessToken_${email}`, accessToken);
  const date = new Date(),
    isoString = date.toISOString();
  await setCacheWithTTL(`accessTokenTime_${email}`, isoString);
};

export const validateToken = async (decoded, token) => {
  const accessToken = await getCache(`accessToken_${decoded.email}`),
    accessTokenTime = await getCache(`accessTokenTime_${decoded.email}`),
    currentDate = new Date(),
    datedISOString = currentDate.toISOString();
  if (accessToken === null || accessTokenTime === null) return false;
  const currentTime = new Date().getTime(),
    lastNotedTime = new Date(accessTokenTime).getTime();
  if (currentTime - lastNotedTime > TOKEN_EXPIRY_TIME * 1000 * 60) return false;
  else
    await setCacheWithTTL(`accessTokenTime_${decoded.email}`, datedISOString);
  if (accessToken !== token) return false;
  return true;
};

export const userSessionClose = async (userEmail) => {
  const email = userEmail.toLowerCase(),
    user = await User.findOne({ email }).lean();
  if (!user)
    return {
      code: 404,
      message: authErrors.USER_NOT_FOUND,
    };
  await client.del(`accessToken_${email}`);
  await client.del(`accessTokenTime_${email}`);
  return {
    code: 200,
    message: authResponses.LOGOUT_SUCCESS,
  };
};
