import express from "express";
import { Auth } from "../Middleware/Auth.js";
import {
  addPost,
  getAllPosts,
  getAllPostsOfUser,
  getPostById,
  getTop5Posts,
  likeDislikePost,
} from "../Controllers/PostControllers.js";
import upload from "../Config/Multer.js";

const postRouter = express.Router();

postRouter.post("/", Auth, upload.single("image"), addPost);

postRouter.post("/like-dislike", Auth, likeDislikePost);

postRouter.get("/get-all-posts", getAllPosts);

postRouter.get("/getPostById/:postId", getPostById);

postRouter.get("/getTop5Posts/:userId", getTop5Posts);

postRouter.get("/getAllPostsOfUser/:userId", getAllPostsOfUser);

export default postRouter;
