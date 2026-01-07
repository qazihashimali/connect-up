import express from "express";
import {
  createNotice,
  deleteNotice,
  getAllNotices,
  updateNotice,
} from "../Controllers/NoticeControllers.js";
import { protectCompany } from "../Middleware/ProtectCompany.js";

const NoticeRouter = express.Router();
NoticeRouter.post("/create-notice", protectCompany, createNotice);
NoticeRouter.get("/get-all-notices", protectCompany, getAllNotices);
NoticeRouter.delete("/delete/:id", protectCompany, deleteNotice);
NoticeRouter.put("/update/:id", protectCompany, updateNotice);

export default NoticeRouter;
