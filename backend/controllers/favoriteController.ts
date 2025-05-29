import { Request, Response } from "express";
import Favorite from "../models/favorite";
import { AuthRequest } from "../middleware/auth";

// Add to favorites
export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.body;
    const exists = await Favorite.findOne({ userId: req.user!._id, propertyId });
    if (exists) return res.status(400).json({ message: "Already favorited" });
    const favorite = await Favorite.create({ userId: req.user!._id, propertyId });
    res.status(201).json(favorite);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all favorites for user
export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favorites = await Favorite.find({ userId: req.user!._id }).populate("propertyId");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from favorites
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.body;
    await Favorite.deleteOne({ userId: req.user!._id, propertyId });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}; 