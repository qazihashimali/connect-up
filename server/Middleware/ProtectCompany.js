import jwt from "jsonwebtoken";
import Company from "../Models/Company.js";

export const protectCompany = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Not authorized" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id).select("-password");
    if (!company)
      return res.json({ success: false, message: "Company not found" });

    req.company = company;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
