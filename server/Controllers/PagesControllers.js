import Page from "../Models/Pages.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../Models/PostModel.js";
import { uploadToS3 } from "../Config/Aws.js";

export const createPage = async (req, res) => {
  try {
    const {
      type,
      name,
      about,
      linkedinUrl,
      website,
      industry,
      size,
      organizationType,
      tagline,
      description,
      founded,
    } = req.body;

    const imageFile = req.file;
    let logo = "";

    // Upload to Cloudinary if image is included
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "company_pages",
      });
      logo = imageUpload.secure_url;
    }

    const page = await Page.create({
      owner: req.user._id,
      type,
      name,
      about,
      linkedinUrl,
      website,
      industry,
      size,
      organizationType,
      tagline,
      description,
      founded,
      logo,
    });

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get all pages (optional filter by type)
export const getAllPages = async (req, res) => {
  try {
    const { type } = req.query;
    const pages = type
      ? await Page.find({ pageType: type })
      : await Page.find();
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pages by user
export const getAllPagesByUser = async (req, res) => {
  try {
    const pages = await Page.find({ owner: req.user._id });
    res.status(200).json({ success: true, pages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single page by ID
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    res.status(200).json({ success: true, page });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update a page
export const updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    res.status(200).json({ success: true, page });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//  Delete a page
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page)
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    res
      .status(200)
      .json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Page posts

// Create a post for a page
// export const createPagePost = async (req, res) => {
//   try {
//     const { pageId } = req.params;
//     const { desc, imageLink } = req.body;

//     // Verify the page exists and user is the owner
//     const page = await Page.findById(pageId);
//     if (!page) {
//       return res.status(404).json({
//         success: false,
//         message: "Page not found",
//       });
//     }

//     // Check if the logged-in user is the page owner
//     if (page.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: "You are not authorized to post on this page",
//       });
//     }

//     // Create post with Page as author
//     const post = await Post.create({
//       authorType: "Page",
//       authorId: pageId,
//       desc,
//       imageLink,
//       likes: [],
//       comments: 0,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Post created successfully",
//       post,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
export const createPagePost = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { desc } = req.body;

    // Verify the page exists and user is the owner
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    // Check if the logged-in user is the page owner
    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to post on this page",
      });
    }

    let imageLink = null;

    // Upload image to S3 if file is present
    if (req.file) {
      imageLink = await uploadToS3(req.file);
    }

    // Validate that post has content
    if (!desc?.trim() && !imageLink) {
      return res.status(400).json({
        success: false,
        message: "Post cannot be empty",
      });
    }

    // Create post with Page as author
    const post = await Post.create({
      authorType: "Page",
      authorId: pageId,
      desc: desc?.trim(),
      imageLink,
      likes: [],
      comments: 0,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create page post error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all posts by a specific page
export const getPagePosts = async (req, res) => {
  try {
    const { pageId } = req.params;

    const posts = await Post.find({
      authorType: "Page",
      authorId: pageId,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get top 5 posts by a page (for preview)
export const getTop5PagePosts = async (req, res) => {
  try {
    const { pageId } = req.params;

    const posts = await Post.find({
      authorType: "Page",
      authorId: pageId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a page post
export const deletePagePost = async (req, res) => {
  try {
    const { pageId, postId } = req.params;

    // Verify page ownership
    const page = await Page.findById(pageId);
    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    if (page.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }

    const post = await Post.findOneAndDelete({
      _id: postId,
      authorType: "Page",
      authorId: pageId,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
