import express from "express";
import { Auth } from "../Middleware/Auth.js";
import {
  addConversation,
  getConversation,
} from "../Controllers/ConversationControllers.js";

const conversationRouter = express.Router();

conversationRouter.post("/add-conversation", Auth, addConversation);

conversationRouter.get("/get-conversation", Auth, getConversation);

export default conversationRouter;
