import express from "express";
import { Auth } from "../Middleware/Auth.js";
import {
  addComment,
  getCommentsByPostId,
} from "../Controllers/CommentsControllers.js";

const CommentsRouter = express.Router();

CommentsRouter.post("/add-Comment", Auth, addComment);
CommentsRouter.get("/get-comments/:postId", getCommentsByPostId);

export default CommentsRouter;
