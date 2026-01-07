import Message from "../Models/MessageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversation, message, picture } = req.body;
    const newMessage = new Message({
      conversation,
      sender: req.user._id,
      message,
      picture,
    });
    await newMessage.save();
    const populateMessage = await newMessage.populate("sender");
    return res.status(200).json({ message: populateMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversation: conversationId,
    }).populate("sender");
    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
