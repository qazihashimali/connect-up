import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
export const Auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || "";
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};
