import QRCode from "qrcode";
import validator from "validator";
import QrCode from "../models/QrCode.js";
import { sendQrCodeEmail } from "../services/emailService.js";

export const generateQrCode = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        message: "URL is required"
      });
    }

    const isValidUrl = validator.isURL(url, {
      protocols: ["http", "https"],
      require_protocol: true
    });

    if (!isValidUrl) {
      return res.status(400).json({
        message: "Please enter a valid URL starting with http:// or https://"
      });
    }

    const qrImage = await QRCode.toDataURL(url, {
      width: 800,
      margin: 2
    });

    const qrCode = await QrCode.create({
      user: req.user._id,
      url,
      qrImage
    });

    res.status(201).json({
      message: "QR code generated successfully",
      qrCode
    });
  } catch (error) {
    res.status(500).json({
      message: "QR code generation failed",
      error: error.message
    });
  }
};

export const getMyQrCodes = async (req, res) => {
  try {
    const qrCodes = await QrCode.find({ user: req.user._id }).sort({
      createdAt: -1
    });

    res.json({
      qrCodes
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch QR codes",
      error: error.message
    });
  }
};

export const downloadQrCode = async (req, res) => {
  try {
    const qrCode = await QrCode.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({
        message: "QR code not found"
      });
    }

    const base64Data = qrCode.qrImage.replace(/^data:image\/png;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="qr-code-${qrCode._id}.png"`
    );

    res.send(imageBuffer);
  } catch (error) {
    res.status(500).json({
      message: "QR code download failed",
      error: error.message
    });
  }
};

export const emailQrCode = async (req, res) => {
  try {
    const qrCode = await QrCode.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!qrCode) {
      return res.status(404).json({
        message: "QR code not found"
      });
    }

    await sendQrCodeEmail({
      email: req.user.email,
      name: req.user.name,
      url: qrCode.url
    });

    res.json({
      message: "QR code email sent successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "QR code email failed",
      error: error.message
    });
  }
};