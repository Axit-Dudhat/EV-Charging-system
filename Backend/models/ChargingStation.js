import mongoose from "mongoose";

const chargingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    powerOutput: {
      type: Number,
      required: true,
    },

    connectorType: {
      type: String,
      enum: ["CCS2", "CHAdeMO", "Type 2", "Tesla Supercharger"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChargingStation = mongoose.model(
  "ChargingStation",
  chargingStationSchema
);

export default ChargingStation;