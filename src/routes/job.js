import express from "express";
import { supabase } from "../config/supabase.js";
import { createJobController } from "../controller/job.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { order = "desc", limit = 10 } = req.query;

    const { data, error } = await supabase
      .from("job_post")
      .select("*")
      .order("created_at", { ascending: order !== "desc" })
      .limit(limit);

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.post("/register", createJobController);

export default router;