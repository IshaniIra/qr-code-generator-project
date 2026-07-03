import express from "express";
import {
  generateQrCode,
  getMyQrCodes,
  downloadQrCode,
  emailQrCode
} from "../controllers/qrController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateQrCode);
router.get("/my-codes", protect, getMyQrCodes);
router.get("/:id/download", protect, downloadQrCode);
router.post("/:id/email", protect, emailQrCode);

export default router;