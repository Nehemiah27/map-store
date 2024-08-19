import mongoose from "mongoose";

const mapMetaSchema = new mongoose.Schema(
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
      lat: {
        type: String,
        required: true,
        trim: true,
      },
      lng: {
        type: String,
        required: true,
        trim: true,
      },
      zoom: {
        type: String,
        required: true,
        trim: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      notes: {
        type: String,
        required: function () {
          return this.notes !== "";
        },
        trim: true,
      },
      mLat: {
        type: String,
        trim: true,
        default: null,
      },
      mLng: {
        type: String,
        trim: true,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  ),
  MapMeta = mongoose.model("MapMeta", mapMetaSchema);

export default MapMeta;
