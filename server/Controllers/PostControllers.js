import Post from "../Models/PostModel.js";

import { uploadToS3 } from "../Config/Aws.js";

// controllers/postController.js
export const addPost = async (req, res) => {
  try {
    const { desc } = req.body;
    const userId = req.user._id;

    let imageLink = null;

    if (req.file) {
      imageLink = await uploadToS3(req.file); // your S3 function
    }

    if (!desc?.trim() && !imageLink) {
      return res
        .status(400)
        .json({ success: false, message: "Post cannot be empty" });
    }

    const newPost = new Post({
      user: userId,
      authorType: "User",
      authorId: userId,
      desc: desc?.trim(),
      imageLink,
    });

    await newPost.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Add post error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// like or dislike a post
export const likeDislikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const index = post.likes.findIndex((id) => id.equals(userId));
    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.status(200).json({
      message: index !== -1 ? "Post disliked" : "Post liked",
      likes: post.likes,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: error.message });
  }
};

// get post by id
export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("user", "-password");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post: post });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: error.message });
  }
};

// get top 5 posts of a user
export const getTop5Posts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "-password");
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: error.message });
  }
};

//Get all posts of a user
export const getAllPostsOfUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password");
    res.status(200).json({ posts: posts });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: error.message });
  }
};
