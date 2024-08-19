import mongoose from "mongoose";

const mapImageSchema = new mongoose.Schema(
    {
      userID: {
        type: String,
        required: true,
        trim: true,
      },
      mapID: {
        type: String,
        required: true,
        trim: true,
      },
      mapImage: {
        type: String,
        required: true,
        trim: true,
      },
      accessCount: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  ),
  MapImage = mongoose.model("MapImage", mapImageSchema);

export default MapImage;
