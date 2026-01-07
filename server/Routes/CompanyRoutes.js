import express from "express";

import upload from "../Config/Multer.js";
import { protectCompany } from "../Middleware/ProtectCompany.js";
import {
  changeJobApplicationStatus,
  changeVisibility,
  getAllUsers,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} from "../Controllers/CompanyControllers.js";

const CompanyRouter = express.Router();

//Register a company
CompanyRouter.post("/register", upload.single("image"), registerCompany);

//Company login
CompanyRouter.post("/login", loginCompany);

//Get company data
CompanyRouter.get("/company-data", protectCompany, getCompanyData);

//Post a job
CompanyRouter.post("/post-job", protectCompany, postJob);

//Get Applicants data of company
CompanyRouter.get("/applicants", protectCompany, getCompanyJobApplicants);

//get company job list
CompanyRouter.get("/list-jobs", protectCompany, getCompanyPostedJobs);

//change application status
CompanyRouter.post(
  "/change-status",
  protectCompany,
  changeJobApplicationStatus
);

//change application visibility
CompanyRouter.post("/change-visibility", protectCompany, changeVisibility);

CompanyRouter.get("/get-all-users", protectCompany, getAllUsers);

export default CompanyRouter;
