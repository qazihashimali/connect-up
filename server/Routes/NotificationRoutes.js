import express from "express";
import { Auth } from "../Middleware/Auth.js";
import {
  activeNotifications,
  getNotifications,
  markNotificationAsRead,
} from "../Controllers/NotificationControllers.js";

const NotificationRouter = express.Router();

NotificationRouter.get("/getNotifications", Auth, getNotifications);
NotificationRouter.put("/isRead", Auth, markNotificationAsRead);
NotificationRouter.get("/activeNotifications", Auth, activeNotifications);

export default NotificationRouter;
