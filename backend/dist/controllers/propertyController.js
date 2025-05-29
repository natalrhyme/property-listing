"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getProperty = exports.getProperties = exports.createProperty = void 0;
const property_1 = __importDefault(require("../models/property"));
const redisClient_1 = require("../utils/redisClient");
// Create property
const createProperty = async (req, res) => {
    try {
        const property = await property_1.default.create({ ...req.body, createdBy: req.user._id });
        await redisClient_1.redisClient.del("properties:all"); // Invalidate cache
        res.status(201).json(property);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.createProperty = createProperty;
// Get all properties (with advanced filtering)
const getProperties = async (req, res) => {
    try {
        const query = {};
        // Add filters for all attributes
        [
            "title", "type", "price", "state", "city", "areaSqFt", "bedrooms", "bathrooms",
            "amenities", "furnished", "availableFrom", "listedBy", "tags", "colorTheme",
            "rating", "isVerified", "listingType"
        ].forEach((attr) => {
            if (req.query[attr])
                query[attr] = req.query[attr];
        });
        // Range filters
        if (req.query.minPrice)
            query.price = { ...query.price, $gte: Number(req.query.minPrice) };
        if (req.query.maxPrice)
            query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
        if (req.query.minBedrooms)
            query.bedrooms = { ...query.bedrooms, $gte: Number(req.query.minBedrooms) };
        if (req.query.maxBedrooms)
            query.bedrooms = { ...query.bedrooms, $lte: Number(req.query.maxBedrooms) };
        // Add more as needed
        const properties = await property_1.default.find(query);
        res.json(properties);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProperties = getProperties;
// Get single property
const getProperty = async (req, res) => {
    try {
        const property = await property_1.default.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: "Not found" });
        res.json(property);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProperty = getProperty;
// Update property (only owner)
const updateProperty = async (req, res) => {
    try {
        const property = await property_1.default.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: "Not found" });
        if (property.createdBy.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Forbidden" });
        Object.assign(property, req.body);
        await property.save();
        await redisClient_1.redisClient.del("properties:all");
        res.json(property);
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateProperty = updateProperty;
// Delete property (only owner)
const deleteProperty = async (req, res) => {
    try {
        const property = await property_1.default.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: "Not found" });
        if (property.createdBy.toString() !== req.user._id.toString())
            return res.status(403).json({ message: "Forbidden" });
        await property.deleteOne();
        await redisClient_1.redisClient.del("properties:all");
        res.json({ message: "Deleted" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteProperty = deleteProperty;
