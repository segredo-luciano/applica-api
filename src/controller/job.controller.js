import { createJobService } from "../services/job.service.js";

export const createJobController = async (req, res) => {
    try {
        const jobInput = req.body;
        const job = await createJobService(req.supabase, jobInput);

        return res.status(201).json(job);
    } catch (error) {
        return res.status(400).json({
            error: error.message || "Failed to create job",
        });
    }
};