

import express from "express";
import {
  registerUser,
  loginUser,
  getDashboard,
  logoutUser,
  refreshToken,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken); // ✅ THIS IS WHERE IT GOES

// Protected route
router.get("/dashboard", protect, getDashboard);
router.post("/logout", logoutUser); // ✅ THIS LINE IS MUST

export default router;


