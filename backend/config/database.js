import mongoose from "mongoose";

const connectDB = async (mongoDBURL) => {
  try {
    await mongoose.connect(mongoDBURL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
