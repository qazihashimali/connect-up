import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  salary: { type: Number, required: true },
  level: { type: String, required: true },
  date: { type: Number, required: true },
  visible: { type: Boolean, default: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  questions: [
    {
      question: { type: String },
      type: {
        type: String,
        enum: ["text", "yesno", "select"],
        default: "text",
      },
      options: [String], // optional for select type
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
