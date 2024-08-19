import { serverErrors } from "../constant/message.constant.js";
import envCaptured from "../config/envValidation.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: err.message || serverErrors.INTERNAL_SERVER_ERROR,
    stack: envCaptured.env === "development" ? err.stack : null,
  });
};

export default errorHandler;
