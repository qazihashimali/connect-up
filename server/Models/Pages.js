import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    type: {
      type: String,

      enum: ["company", "institute", "personal"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    website: { type: String },
    industry: { type: String, required: true },
    size: { type: String },
    organizationType: { type: String },
    description: { type: String },
    tagline: { type: String },
    logo: { type: String },
    cover_image: { type: String },
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", pageSchema);
export default Page;
