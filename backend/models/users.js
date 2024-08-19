import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        default: "",
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
      },
      pending: {
        type: Boolean,
        default: false,
      },
      isEmailSent: {
        type: Boolean,
        required: true,
        default: false,
      },
      userID: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  ),
  User = mongoose.model("User", usersSchema);

export default User;
