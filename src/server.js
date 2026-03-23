import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import recruitersRoutes from "./routes/recruiter.js";
import jobsRoutes from "./routes/job.js";
import applicationsRoutes from "./routes/application.js";
import { supabaseMiddleware } from "./middleware/supabase.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(supabaseMiddleware);

app.use("/recruiter", recruitersRoutes);
app.use("/job", jobsRoutes);
app.use("/application", applicationsRoutes);

app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});