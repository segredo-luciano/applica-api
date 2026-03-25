import { applyToJob } from "../services/application.service"

export const applyYoJob = async(req, res) => {
    try {
        const apply = await applyToJob(req.supabase, input);

        return res.status(201).json(apply);
    } catch (error) {
        return res.status(400).json({
            error: error.message || "Failed to create job",
        });
    }
}