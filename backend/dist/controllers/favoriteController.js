"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.getFavorites = exports.addFavorite = void 0;
const favorite_1 = __importDefault(require("../models/favorite"));
// Add to favorites
const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const exists = await favorite_1.default.findOne({ userId: req.user._id, propertyId });
        if (exists)
            return res.status(400).json({ message: "Already favorited" });
        const favorite = await favorite_1.default.create({ userId: req.user._id, propertyId });
        res.status(201).json(favorite);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.addFavorite = addFavorite;
// Get all favorites for user
const getFavorites = async (req, res) => {
    try {
        const favorites = await favorite_1.default.find({ userId: req.user._id }).populate("propertyId");
        res.json(favorites);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getFavorites = getFavorites;
// Remove from favorites
const removeFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        await favorite_1.default.deleteOne({ userId: req.user._id, propertyId });
        res.json({ message: "Removed from favorites" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeFavorite = removeFavorite;
