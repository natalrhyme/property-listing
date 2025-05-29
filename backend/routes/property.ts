import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} from "../controllers/propertyController";
import { authenticate } from "../middleware/auth";
import { cache } from "../middleware/cache";

const router = express.Router();

router.get("/", cache("properties:all"), getProperties);
router.get("/:id", getProperty);
router.post("/", authenticate, createProperty);
router.put("/:id", authenticate, updateProperty);
router.delete("/:id", authenticate, deleteProperty);

export default router; 