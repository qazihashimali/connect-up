// import mongoose from "mongoose";

// const postSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     desc: {
//       type: String,
//     },
//     imageLink: {
//       type: String,
//     },
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     comments: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

// export default Post;

import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Author can be either User or Page
    authorType: {
      type: String,
      enum: ["User", "Page"],
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "authorType",
    },
    // Keep user for backward compatibility with existing user posts
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    desc: {
      type: String,
    },
    imageLink: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
