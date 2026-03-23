

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // 🔐 Protect Middleware (Check token from COOKIE or HEADER)
// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     // 🍪 1️⃣ Check for token in cookies
//     if (req.cookies?.token) {
//       token = req.cookies.token;
//     }
//     // 🔗 2️⃣ Check for token in Authorization header (Bearer token)
//     else if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     // ❌ 3️⃣ No token found
//     if (!token) {
//       return res.status(401).json({ message: "No token provided ❌" });
//     }

//     // 🔍 4️⃣ Verify token
//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET);
//     } catch (err) {
//       return res.status(401).json({ message: "Invalid or expired token ❌" });
//     }

//     // 👤 5️⃣ Fetch user from DB (excluding password)
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ message: "User not found ❌" });
//     }

//     // ✅ 6️⃣ Attach user to request object
//     req.user = user;

//     next(); // Proceed to next middleware or route
//   } catch (err) {
//     console.error("Protect Middleware Error:", err);
//     return res.status(401).json({ message: "Invalid token ❌" });
//   }
// };




import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Check cookie (FIXED)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    // ✅ Check header
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided ❌" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token ❌" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found ❌" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("Protect Middleware Error:", err);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};
