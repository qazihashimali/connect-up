import express from "express";
import {
  createPage,
  createPagePost,
  deletePage,
  deletePagePost,
  getAllPages,
  getAllPagesByUser,
  getPageById,
  getPagePosts,
  getTop5PagePosts,
  updatePage,
} from "../Controllers/PagesControllers.js";
import upload from "../Config/Multer.js";
import { Auth } from "../Middleware/Auth.js";

const PageRouter = express.Router();

PageRouter.post("/", Auth, createPage);
PageRouter.get("/user-pages", Auth, getAllPagesByUser);
PageRouter.get("/all-pages", getAllPages);
PageRouter.get("/:id", getPageById);
PageRouter.put("/:id", updatePage);
PageRouter.delete("/:id", deletePage);

PageRouter.post("/:pageId/post", Auth, upload.single("image"), createPagePost);
PageRouter.get("/:pageId/posts", getPagePosts);
PageRouter.get("/:pageId/posts/top5", getTop5PagePosts);
PageRouter.delete("/:pageId/post/:postId", Auth, deletePagePost);

export default PageRouter;
