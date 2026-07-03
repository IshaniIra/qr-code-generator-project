import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/qr", qrRoutes);

app.get("/", (req, res) => {
  res.send("QR Code Generator API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});