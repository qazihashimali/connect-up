import Post from "../Models/PostModel.js";
import Comment from "../Models/CommentModel.js";
import Notification from "../Models/Notifications.js";

//Add Comment

// export const addComment = async (req, res) => {
//   try {
//     const { postId, comment } = req.body;
//     const userId = req.user._id;

//     const postExist = await Post.findById(postId).populate("user");
//     if (!postExist) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     postExist.comments = postExist.comments + 1;
//     await postExist.save();
//     const newComment = new Comment({
//       post: postId,
//       user: userId,
//       comment,
//     });
//     await newComment.save();
//     const populateComment = await Comment.findById(newComment._id).populate(
//       "user",
//       "f_name headline profile_pic"
//     );
//     const content = `${req.user.f_name} commented on your post`;
//     const notification = new Notification({
//       sender: userId,
//       receiver: postExist.user._id,
//       content,
//       type: "comment",
//       postId: postId.toString(),
//     });
//     await notification.save();
//     return res.status(201).json({
//       message: "Comment added successfully",
//       comment: populateComment,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

export const addComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    const postExist = await Post.findById(postId).populate("authorId");

    if (!postExist) {
      return res.status(404).json({ message: "Post not found" });
    }
    postExist.comments = postExist.comments + 1;
    await postExist.save();
    const newComment = new Comment({
      post: postId,
      user: userId,
      comment,
    });
    await newComment.save();
    const populateComment = await Comment.findById(newComment._id).populate(
      "user"
      // "f_name  headline profile_pic"
    );

    const content = `${
      req.user?.name || req.user?.f_name
    } commented on your post`;
    const notification = new Notification({
      sender: userId,
      receiver: postExist.authorId._id,
      content,
      type: "comment",
      postId: postId.toString(),
    });

    await notification.save();
    return res.status(201).json({
      message: "Comment added successfully",
      comment: populateComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
//Get Comments by PostId

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const isPostExist = await Post.findById(postId);
    if (!isPostExist) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.find({ post: postId }).populate(
      "user",
      "f_name headline profile_pic"
    );
    return res.status(200).json({ comments: comments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
