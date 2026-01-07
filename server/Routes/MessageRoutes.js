import express from "express";
import { Auth } from "../Middleware/Auth.js";
import { getMessage, sendMessage } from "../Controllers/MessageControllers.js";

const messageRouter = express.Router();

messageRouter.post("/send-message", Auth, sendMessage);
messageRouter.get("/get-message/:conversationId", Auth, getMessage);

export default messageRouter;
