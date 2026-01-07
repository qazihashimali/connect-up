import Notification from "../Models/Notifications.js";
//Get notification
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ receiver: userId })
      .sort({
        createdAt: -1,
      })
      .populate("sender receiver");
    return res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    const notification = await Notification.findByIdAndUpdate(notificationId, {
      isRead: true,
    });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

//Active notifications
export const activeNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      receiver: userId,
      isRead: false,
    }).populate("sender receiver");
    return res.status(200).json({ count: notifications.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
