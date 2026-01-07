import User from "../Models/UserModel.js";
import Notification from "../Models/Notifications.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import JobApplication from "../Models/JobApplication.js";
import Job from "../Models/Job.js";
import { sendEmail } from "../Config/SendEmail.js";
import Page from "../Models/Pages.js";

const cookieOptions = {
  httpOnly: true,
  secure: false, // Set to true if using HTTPS
  sameSite: "lax", //Set None in production
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

//Register User
export const registerUser = async (req, res) => {
  try {
    const { f_name, email, password } = req.body;
    if (!f_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User({ f_name, email, password: encryptedPassword });
    await user.save();
    res.status(200).json({
      message: "User registered successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Login User

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "User not found" });
    }

    if (userExist && !userExist.password) {
      return res.status(400).json({ message: "Please login through Google" });
    }
    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "Login successful",
      success: true,
      userExist: userExist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Login through google

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      const user = new User({
        f_name: name,
        email,
        googleId: sub,
        profilePic: picture,
      });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, cookieOptions);
      await user.save();
      res.status(200).json({
        message: "User registered successfully",
        success: true,
        user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Endpoint to get self user details

export const getSelfUser = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

//update user profile

export const updateUser = async (req, res) => {
  try {
    const { user } = req.body;
    const isExist = await User.findById(req.user._id);
    if (!isExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(isExist._id, user);
    if (!updatedUser) {
      return res.status(400).json({ message: "User not updated" });
    }
    const userData = await User.findById(req.user._id);
    res
      .status(200)
      .json({ message: "Profile updated successfully", data: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Get all users

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}).populate("friends");
//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error", message: error.message });
//   }
// };

export const getAllUsers = async (req, res) => {
  try {
    const user = req.user._id;
    const users = await User.find({ _id: { $ne: user } }).populate("friends");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Get user by id

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Find user

// export const findUser = async (req, res) => {
//   try {
//     let { query } = req.query;
//     const users = await User.find({
//       $and: [
//         { _id: { $ne: req.user._id } },
//         {
//           $or: [
//             { name: { $regex: new RegExp(`^${query}`, "i") } },
//             { email: { $regex: new RegExp(`^${query}`, "i") } },
//           ],
//         },
//       ],
//     });
//     return res.status(200).json({ success: true, users: users });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server Error", message: error.message });
//   }
// };

export const findUser = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query)
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });

    // Regex to match anywhere, case-insensitive
    const searchRegex = new RegExp(query, "i");

    // Search Users (exclude current user)
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: searchRegex }, { email: searchRegex }],
    });

    // Search Pages
    const pages = await Page.find({
      $or: [
        { name: searchRegex },
        { tagline: searchRegex },
        { industry: searchRegex },
      ],
    });

    return res.status(200).json({ success: true, users, pages });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

//Send Friend Request

export const sendFriendRequest = async (req, res) => {
  try {
    const sender = req.user._id;
    const { receiver } = req.body;
    const userExist = await User.findById(receiver);
    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = req.user.friends.findIndex((id) => id.equals(receiver));
    if (index !== -1) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }
    const lastIndex = userExist.pending_friends.findIndex((id) =>
      id.equals(req.user._id)
    );
    if (lastIndex !== -1) {
      return res
        .status(400)
        .json({ message: "Friend request already sent to this user" });
    }
    userExist.pending_friends.push(sender);
    let content = `${req.user.f_name} sent you a friend request`;
    const notification = new Notification({
      sender,
      receiver,
      content,
      type: "friendRequest",
    });
    await notification.save();
    await userExist.save();
    res
      .status(200)
      .json({ message: "Friend request sent successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Accept Friend Request

export const acceptFriendRequest = async (req, res) => {
  try {
    const { receiver } = req.body;
    const selfId = req.user._id;
    const friendData = await User.findById(receiver);
    if (!friendData) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = req.user.pending_friends.findIndex((id) =>
      id.equals(receiver)
    );
    if (index !== -1) {
      req.user.pending_friends.splice(index, 1);
    } else {
      return res
        .status(400)
        .json({ message: "No friend request found for this user" });
    }

    req.user.friends.push(receiver);
    friendData.friends.push(selfId);
    let content = `${req.user.f_name} accepted your friend request`;
    const notification = new Notification({
      sender: selfId,
      receiver: receiver,
      content,
      type: "friendRequest",
    });
    await notification.save();
    await req.user.save();
    await friendData.save();
    res
      .status(200)
      .json({ message: "You are both connected now", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Friend List
export const friendList = async (req, res) => {
  try {
    const friends = await User.findById(req.user._id).populate("friends");
    res.status(200).json({ success: true, friends: friends.friends });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//pending friends
export const pendingFriends = async (req, res) => {
  try {
    const pendingFriends = await User.findById(req.user._id).populate(
      "pending_friends"
    );
    res
      .status(200)
      .json({ success: true, pendingFriends: pendingFriends.pending_friends });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//disconnect friend
export const removeFriend = async (req, res) => {
  const { friendId } = req.params;
  const selfId = req.user._id;
  const friendData = await User.findById(friendId);
  if (!friendData) {
    return res.status(404).json({ message: "User not found" });
  }
  const index = req.user.friends.findIndex((id) => id.equals(friendId));
  const friendIndex = friendData.friends.findIndex((id) => id.equals(selfId));
  if (index !== -1) {
    req.user.friends.splice(index, 1);
  } else {
    return res
      .status(400)
      .json({ message: "No friend request found for this user" });
  }
  if (friendIndex !== -1) {
    friendData.friends.splice(friendIndex, 1);
  } else {
    return res
      .status(400)
      .json({ message: "No friend request found for this user" });
  }
  await req.user.save();
  await friendData.save();
  res
    .status(200)
    .json({ message: "You are both disconnected now", success: true });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};

//Apply for a job
export const applyForJob = async (req, res) => {
  const { jobId, answers } = req.body;
  const userId = req.user?._id;

  try {
    // 1) check already applied
    const isAlreadyApplied = await JobApplication.findOne({ userId, jobId });
    if (isAlreadyApplied) {
      return res.json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // 2) find job
    const jobData = await Job.findById(jobId).populate(
      "companyId",
      "name email"
    );
    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    // 3) create application
    const createdApplication = await JobApplication.create({
      companyId: jobData.companyId?._id,
      userId,
      answers,
      jobId,
      date: Date.now(),
    });

    // 4) populate created application with job/company/user for email content
    const populatedApplication = await JobApplication.findById(
      createdApplication._id
    )
      .populate("jobId", "title location level")
      .populate("companyId", "name email")
      .populate("userId", "name email") // ensure your User model has name & email
      .exec();

    // 5) prepare email content
    const userEmail = populatedApplication?.userId?.email;
    const userName = populatedApplication?.userId?.name || "Applicant";
    const jobTitle = populatedApplication?.jobId?.title || "the job";
    const companyName = populatedApplication?.companyId?.name || "Company";
    const companyEmail = populatedApplication?.companyId?.email;

    // User confirmation email (HTML)
    const userHtml = `
      <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <h2>Application Received</h2>
        <p>Hi ${userName},</p>
        <p>Thanks for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
        <p>We have received your application and will notify you about next steps.</p>
        <hr />
        <p style="font-size:13px;color:#666;">If you didn't apply, please contact us.</p>
      </div>
    `;

    // Company notification email (HTML)
    const companyHtml = `
      <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
        <h2>New Job Application</h2>
        <p>Hello ${companyName},</p>
        <p>A new application was submitted for <strong>${jobTitle}</strong>.</p>
        <p><strong>Applicant:</strong> ${userName} (${
      userEmail || "No email provided"
    })</p>
        <p>Please check your dashboard for details.</p>
      </div>
    `;

    // 6) send emails (but do not fail the main request if email sending fails)
    if (userEmail) {
      const userEmailResult = await sendEmail({
        to: userEmail,
        subject: `Application received for ${jobTitle}`,
        html: userHtml,
      });

      if (!userEmailResult.success) {
        console.error("User confirmation email failed:", userEmailResult.error);
      }
    }

    if (companyEmail) {
      const companyEmailResult = await sendEmail({
        to: companyEmail,
        subject: `New application for ${jobTitle}`,
        html: companyHtml,
      });

      if (!companyEmailResult.success) {
        console.error(
          "Company notification email failed:",
          companyEmailResult.error
        );
      }
    }

    // 7) final response
    return res.json({
      success: true,
      message: "Job application submitted successfully",
      application: populatedApplication,
    });
  } catch (error) {
    console.error("applyForJob error:", error);
    return res.json({ success: false, message: error.message });
  }
};

//get user applied jobs
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location salary level category")
      .exec();
    if (!applications) {
      return res.json({ success: false, message: "No job applications found" });
    }
    return res.json({ success: true, applications });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
