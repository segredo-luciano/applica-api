import { createJobService, getJobListFiltered } from "../services/job.service.js";

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

export const getJobListFilteredController = async (req, res) => {
    try {
        const {
        title,
        company,
        range,        
        mostRecent,
        } = req.query;

        const filters = {
        title: title || null,
        company: company || null,
        range: range || null,
        mostRecent: mostRecent || true,
        };
        const job = await getJobListFiltered(req.supabase, filters);

        return res.status(200).json(job);
    } catch (error) {
        return res.status(400).json({
            error: error.message || "Failed to create job",
        });
    }
}