import express from "express";
import Noticeboard from "../Models/NoticeModel.js";

//Contoller to create notice
export const createNotice = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      expiryDate,
      isActive,
      attachments,
    } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Get postedBy from authenticated user
    const postedBy = req.company?.name || "ESS_APP";

    const newNotice = new Noticeboard({
      title,
      content,
      category: category?.toLowerCase() || "general",
      priority: priority || 1,
      postedBy,
      expiryDate,
      isActive: isActive !== undefined ? isActive : true,
      attachments: attachments || [],
    });

    await newNotice.save();

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: newNotice,
    });
  } catch (error) {
    console.error("Error creating notice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

//Get all notices
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Noticeboard.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notices });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
      error: error.message,
    });
  }
};

//Delete notice
export const deleteNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    await Noticeboard.findByIdAndDelete(noticeId);
    res.status(200).json({ success: true, message: "Notice deleted" });
  } catch (error) {
    console.error("Error deleting notice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
      error: error.message,
    });
  }
};

//Update notice
export const updateNotice = async (req, res) => {
  try {
    const noticeId = req.params.id;
    const updatedNotice = await Noticeboard.findByIdAndUpdate(
      noticeId,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, notice: updatedNotice });
  } catch (error) {
    console.error("Error updating notice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notice",
      error: error.message,
    });
  }
};
