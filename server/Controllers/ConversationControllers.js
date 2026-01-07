import Conversation from "../Models/ConversationModel.js";
import Message from "../Models/MessageModel.js";

//Add Conversation
export const addConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, message } = req.body;
    const ConversationExist = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!ConversationExist) {
      // Create new conversation if it doesn’t exist
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();

      const newMessage = new Message({
        conversation: newConversation._id,
        sender: senderId,
        message,
      });
      await newMessage.save();
    } else {
      // If conversation already exists, just add the message
      const newMessage = new Message({
        conversation: ConversationExist._id,
        sender: senderId,
        message,
      });
      await newMessage.save();
    }
    return res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

//Get Conversation
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({ conversations: conversations });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
