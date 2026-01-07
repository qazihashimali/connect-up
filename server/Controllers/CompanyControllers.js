import Company from "../Models/Company.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import genrateToken from "../Utils/genrateToken.js";
import Job from "../Models/Job.js";
import JobApplication from "../Models/JobApplication.js";
import User from "../Models/UserModel.js";
import { sendEmail } from "../Config/SendEmail.js";

//Register a new company
export const registerCompany = async (req, res) => {
  // console.log('Request body:', req.body);
  // console.log('Request file:', req.file);
  const { name, email, password } = req.body;
  const imageFile = req.file;
  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.json({ success: false, message: "Company already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url,
    });
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: genrateToken(company._id),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Login a company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({ email });
    if (await bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image,
        },
        token: genrateToken(company._id),
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get company details
export const getCompanyData = async (req, res) => {
  try {
    const company = req.company;

    res.json({ success: true, company });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//post a new job
export const postJob = async (req, res) => {
  const { title, description, location, salary, level, category, questions } =
    req.body;

  const companyId = req.company._id;

  try {
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category,
      questions,
    });

    await newJob.save();
    res.json({ success: true, message: "Job posted successfully", newJob });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//get company job Applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    //Find job applications for user and populate related data
    const applications = await JobApplication.find({ companyId })
      .populate("userId")
      .populate("jobId", "title location category level salary")
      .exec();
    res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get comapny posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ companyId });
    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.find({ jobId: job._id });
        return { ...job.toObject(), applicants: applicants.length };
      })
    );
    res.json({ success: true, jobsData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Change job Application Status
export const changeJobApplicationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    // 1️⃣ Update job application status
    const jobApplication = await JobApplication.findOneAndUpdate(
      { _id: id },
      { status },
      { new: true } // return updated document
    )
      .populate("userId", "email f_name")
      .populate("jobId", "title")
      .populate("companyId", "name");

    if (!jobApplication) {
      return res.json({ success: false, message: "Application not found" });
    }

    // 2️⃣ Prepare email details
    const applicantName = jobApplication.userId?.f_name;
    const applicantEmail = jobApplication.userId?.email;
    const jobTitle = jobApplication.jobId?.title;
    const companyName = jobApplication.companyId?.name;

    // 3️⃣ Build email content dynamically
    let subject = "";
    let html = "";

    if (status === "Accepted") {
      subject = `Your application for ${jobTitle} has been accepted!`;
      html = `
        <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
          <h2>Congratulations, ${applicantName} 🎉</h2>
          <p>We are pleased to inform you that your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <span style="color:green;font-weight:bold;">Accepted</span>.</p>
          <p>Our team will contact you soon with further steps.</p>
          <hr/>
          <p style="font-size:13px;color:#777;">Thank you for applying through our job portal.</p>
        </div>
      `;
    } else if (status === "Rejected") {
      subject = `Update on your application for ${jobTitle}`;
      html = `
        <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
          <h2>Hello ${applicantName},</h2>
          <p>Thank you for applying for <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          <p>After careful consideration, we regret to inform you that your application was <span style="color:red;font-weight:bold;">not selected</span> for this position.</p>
          <p>We encourage you to apply for other roles that match your profile in the future.</p>
          <hr/>
          <p style="font-size:13px;color:#777;">We wish you success in your career journey!</p>
        </div>
      `;
    }

    // 4️⃣ Send email only if applicant has an email
    if (applicantEmail && (status === "Accepted" || status === "Rejected")) {
      const emailResult = await sendEmail({
        to: applicantEmail,
        subject,
        html,
      });

      if (!emailResult.success) {
        console.error(
          "❌ Failed to send application status email:",
          emailResult.error
        );
      }
    }

    // 5️⃣ Send success response
    return res.json({
      success: true,
      message: "Status updated and applicant notified",
      jobApplication,
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

//change job visibility
export const changeVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;
    const job = await Job.findById(id);
    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible;
    }
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("friends");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", message: error.message });
  }
};
