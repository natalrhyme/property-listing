"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const redisClient_1 = require("./utils/redisClient");
const auth_1 = __importDefault(require("./routes/auth"));
const property_1 = __importDefault(require("./routes/property"));
const favorite_1 = __importDefault(require("./routes/favorite"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
app.use("/api/properties", property_1.default);
app.use("/api/favorites", favorite_1.default);
const PORT = process.env.PORT || 5000;
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => console.error("MongoDB connection error:", err));
redisClient_1.redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
