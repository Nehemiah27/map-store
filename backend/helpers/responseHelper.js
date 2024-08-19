import envCaptured from "../config/envValidation.js";

export const successResponse = (res, message, data = null) => {
  res.status(200).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, message, statusCode = 500, stack = "") => {
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(stack !== "" && {
      stack: envCaptured.env === "development" ? stack : "",
    }),
  });
};
