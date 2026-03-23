

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔐 Access Token (short life)
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// 🔄 Refresh Token (long life)
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// 📝 REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields required ❌" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists ❌" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({ message: "User Registered Successfully ✅" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error ❌" });
    }
};

// 🔑 LOGIN (Cookie Based)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email ❌" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password ❌" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 1 minute
            sameSite: "None",
            secure: true, // set true in production with HTTPS
        })
        // 🍪 Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // true in production (HTTPS)
            sameSite: "None",
            maxAge: 7 * 60 * 60 * 1000, // 7 days
        });

        res.json({ accessToken, message: "Login success ✅" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// 🔄 REFRESH TOKEN
export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: "No refresh token ❌" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token ❌" });
    }
};

// 🔐 LOGOUT
export const logoutUser = (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out ✅" });
};

// 🔐 DASHBOARD (Protected)
export const getDashboard = async (req, res) => {
    res.json({
        message: "Welcome to Dashboard 🎉",
        user: req.user,
    });
};
