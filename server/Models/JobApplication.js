import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  date: {
    type: Number,
    required: true,
  },

  answers: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
});

const JobApplication =
  mongoose.models.jobApplication ||
  mongoose.model("jobApplication", jobApplicationSchema);

export default JobApplication;
