import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      default: "",
    },
    googleId: {
      type: String,
    },
    headline: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      // required: true,
    },
    curr_company: {
      type: String,
      default: "",
    },
    curr_location: {
      type: String,
      default: "",
    },
    profile_pic: {
      type: String,
      default: "",
    },
    cover_pic: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
    },

    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        designation: { type: String, default: "" },
        duration: { type: String, default: "" },
        company_name: { type: String, default: "" },
        location: { type: String, default: "" },
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pending_friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        field_of_study: { type: String, default: "" },
        duration: { type: String, default: "" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
