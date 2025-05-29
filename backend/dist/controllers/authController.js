"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existing = await user_1.default.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already exists" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await user_1.default.create({ email, password: hashed, name });
        res.status(201).json({ message: "User registered" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const match = await bcryptjs_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
