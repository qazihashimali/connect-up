import express from "express";
import {
  acceptFriendRequest,
  applyForJob,
  findUser,
  friendList,
  getAllUsers,
  getSelfUser,
  getUserById,
  getUserJobApplications,
  googleLogin,
  loginUser,
  logout,
  pendingFriends,
  registerUser,
  removeFriend,
  sendFriendRequest,
  updateUser,
} from "../Controllers/UserControllers.js";
import { Auth } from "../Middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/google", googleLogin);

userRouter.put("/update", Auth, updateUser);

userRouter.get("/self", Auth, getSelfUser);

userRouter.get("/all-users", Auth, getAllUsers);

userRouter.get("/user/:id", getUserById);

userRouter.post("/logout", Auth, logout);

userRouter.get("/findUser", Auth, findUser);

userRouter.post("/sendFriendRequest", Auth, sendFriendRequest);

userRouter.post("/acceptFriendRequest", Auth, acceptFriendRequest);

userRouter.get("/friendList", Auth, friendList);

userRouter.get("/pending-friends", Auth, pendingFriends);

userRouter.delete("/remove-friend/:friendId", Auth, removeFriend);

userRouter.post("/apply", Auth, applyForJob);

userRouter.get("/applied-jobs", Auth, getUserJobApplications);

export default userRouter;
