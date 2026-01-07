import express from "express";
import { getAllJobs, getJobById } from "../Controllers/JobControllers.js";

const JobRouter = express.Router();

//Routes to get all jobs data
JobRouter.get("/", getAllJobs);

//Routes to get a single job by id
JobRouter.get("/:id", getJobById);

export default JobRouter;
