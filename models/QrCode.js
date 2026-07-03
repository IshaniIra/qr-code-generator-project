import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    url: {
      type: String,
      required: true,
      trim: true
    },

    qrImage: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const QrCode = mongoose.model("QrCode", qrCodeSchema);

export default QrCode;