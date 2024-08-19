import express, { json } from "express";
import cors from "cors";
import envCaptured from "./config/envValidation.js";
import connectDB from "./config/database.js";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import setupSwagger from "./swagger/swaggerConfig.js";
import globalException from "./middlewares/globalException.js";

const app = express(),
  PORT = envCaptured.port;
connectDB(envCaptured.mongoose.url);
app.use(json({ limit: "50mb" }));
app.use(cors());
setupSwagger(app);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/map", mapRoutes);
app.use(errorHandler);
app.use(globalException);

app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});
