import mongoose from "mongoose";
const NoticeboardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "urgent", "announcement", "event", "policy"],
      default: "general",
    },
    priority: { type: Number, default: 1 },
    postedBy: { type: String, required: true },
    expiryDate: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    attachments: [{ type: Array }],
  },
  { timestamps: true }
);

const Noticeboard =
  mongoose.models.Noticeboard ||
  mongoose.model("Noticeboard", NoticeboardSchema);

export default Noticeboard;
