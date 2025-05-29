import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { redisClient } from "./utils/redisClient";
import authRoutes from "./routes/auth";
import propertyRoutes from "./routes/property";
import favoriteRoutes from "./routes/favorite";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});
