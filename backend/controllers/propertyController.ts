import { Request, Response } from "express";
import Property from "../models/property";
import { AuthRequest } from "../middleware/auth";
import { redisClient } from "../utils/redisClient";

// Create property
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.create({ ...req.body, createdBy: req.user!._id });
    await redisClient.del("properties:all"); // Invalidate cache
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all properties (with advanced filtering)
export const getProperties = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    // Add filters for all attributes
    [
      "title", "type", "price", "state", "city", "areaSqFt", "bedrooms", "bathrooms",
      "amenities", "furnished", "availableFrom", "listedBy", "tags", "colorTheme",
      "rating", "isVerified", "listingType"
    ].forEach((attr) => {
      if (req.query[attr]) query[attr] = req.query[attr];
    });
    // Range filters
    if (req.query.minPrice) query.price = { ...query.price, $gte: Number(req.query.minPrice) };
    if (req.query.maxPrice) query.price = { ...query.price, $lte: Number(req.query.maxPrice) };
    if (req.query.minBedrooms) query.bedrooms = { ...query.bedrooms, $gte: Number(req.query.minBedrooms) };
    if (req.query.maxBedrooms) query.bedrooms = { ...query.bedrooms, $lte: Number(req.query.maxBedrooms) };
    // Add more as needed

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single property
export const getProperty = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update property (only owner)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    if (property.createdBy.toString() !== req.user!._id.toString())
      return res.status(403).json({ message: "Forbidden" });
    Object.assign(property, req.body);
    await property.save();
    await redisClient.del("properties:all");
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete property (only owner)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Not found" });
    if (property.createdBy.toString() !== req.user!._id.toString())
      return res.status(403).json({ message: "Forbidden" });
    await property.deleteOne();
    await redisClient.del("properties:all");
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}; 