import express from "express";
import connectDB from "./Config/Connection.js";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./Routes/UserRoutes.js";
import postRouter from "./Routes/PostRoutes.js";
import NotificationRouter from "./Routes/NotificationRoutes.js";
import CommentsRouter from "./Routes/CommentsRoutes.js";
import conversationRouter from "./Routes/ConversationRoutes.js";
import messageRouter from "./Routes/MessageRoutes.js";
import { Server } from "socket.io";
import http from "http";
import JobRouter from "./Routes/jobRoutes.js";
import CompanyRouter from "./Routes/CompanyRoutes.js";
import connectCloudinary from "./Config/Cloudinary.js";
import PageRouter from "./Routes/PagesRoutes.js";
import NoticeRouter from "./Routes/NoticeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Socket IO Server
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

// Socket IO connection

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinConversation", (conversationId) => {
    console.log(`User joined conversation ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("sendMessage", (chat) => {
    console.log("Message Sent");
    // console.log({ chat });
    if (!chat.activeConversationId) {
      return console.error("activeConversationId not found");
    }
    io.to(chat.activeConversationId).emit(
      "receiveMessage",
      chat.message.message
    );
  });
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/post", postRouter);
app.use("/api/notification", NotificationRouter);
app.use("/api/comment", CommentsRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.use("/api/jobs", JobRouter);
app.use("/api/company", CompanyRouter);
app.use("/api/page", PageRouter);
app.use("/api/notice", NoticeRouter);

//Database
await connectDB();
await connectCloudinary();

//Message
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

export default server;
