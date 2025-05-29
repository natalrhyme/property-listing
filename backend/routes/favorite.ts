import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controllers/favoriteController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

router.get("/", authenticate, getFavorites);
router.post("/", authenticate, addFavorite);
router.delete("/", authenticate, removeFavorite);

export default router; 