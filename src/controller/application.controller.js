import { applyToJob, getJobApplications } from "../services/application.service.js"

export const applyToJobController = async(req, res) => {
    try {
        const file = req.file;
        const code = req.body.job_code;

        if (!file) {
            return res.status(400).json({ error: "Envie um arquivo para se candidatar!" });
        }

        if (file.mimetype !== "application/pdf") {
            return res.status(400).json({ error: "Envie o currículo no formato 'PDF'" });
        }
        const apply = await applyToJob(req.supabase, {
                job_code: code,
                file,
            }
        );

        return res.status(201).json(apply);
    } catch (error) {        
        if (error.code == 23505 &&
            error.message?.includes('unique_application')
        ) {
            return res.status(409).json({
                message: "Você já se candidatou para esta vaga.",
            });
        }

        return res.status(500).json({
            message: "Falha ao se aplicar para a vaga"
        });
    }
}

export const getApplicationsByJob = async (req, res) => {
    try {
        const { jobCode, page } = req.query;

        const applications = await getJobApplications(req.supabase, page, jobCode);
    
        return res.status(200).json(applications);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Falha ao listar candidaturas' });
    }
}