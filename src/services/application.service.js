import { supabaseAdmin } from "../middleware/supabase.js";
import { getJobApplicationsRepository, insertApplication } from "../repository/application.repository.js";
import { base64ToBuffer, generateFileHash } from "../utils/file.util.js";
import { APPLICATION_STATUS } from "../enum/applicationStatus.enum.js";
import { getJobByCode } from "./job.service.js";

export const applyToJob = async (supabase, { job_code, file }) => {
    const job = await getJobByCode(supabase, job_code)
    if(!job) {
        throw new Error("Não foi encontrado vaga com o código enviado")
    }
    
    const buffer = file.buffer;
    const cv_hash = generateFileHash(buffer);
    let cv_url = null;
    
    try {
        cv_url = await uploadCV(buffer, file.mimetype, job.id);
        
        const applyObj = {
            cv_hash,
            cv_url,
            status: APPLICATION_STATUS.PENDING,
            job_post_id: job.id
        }
    
        const data = await insertApplication(supabase, applyObj);
    
        return data;
    } catch (error) {
        if(cv_url) {
            await deleteCV(cv_url);
        }

        throw error;
    }
}

export const getJobApplications = async (supabase, page, jobCode) => {
    const job = await getJobByCode(supabase, jobCode);
    const applications = await getJobApplicationsRepository(supabase, page, job?.id)

    const result = await Promise.all(
        applications.data.map(async (app) => {
            const { data: signed, error: signError } = await supabaseAdmin.storage
                .from("cvs")
                .createSignedUrl(app.cv_url, 3600);

            if (signError) throw new Error(signError.message);

            return {
                code: app.code,
                createdAt: app.created_at,
                status: app.status,
                viewed: app.viewed,
                cvUrl: signed.signedUrl                
            };
        })
    );

    return {
        data: result,
        total: applications.total,
        page: applications.page,
        limit: applications.limit
    };
}

const uploadCV = async (buffer, mime, job_id) => {
    const fileName = `${job_id}/${Date.now()}.pdf`;

    const { error } = await supabaseAdmin.storage
    .from("cvs")
    .upload(fileName, buffer, {
        contentType: mime,
    });

    if (error) throw error;

    const { data } = supabaseAdmin.storage
    .from("cvs")
    .getPublicUrl(fileName);

    return fileName;
};

const deleteCV = async (cv_url) => {
    try {
        const path = cv_url.split("/cvs/")[1];

        if (!path) {
            throw new Error("Invalid CV URL, cannot extract path");
        }

        const { error } = await supabaseAdmin.storage
            .from("cvs")
            .remove([path]);

        if (error) {
            throw error;
        }

    } catch (err) {
        console.error("Error deleting CV:", err.message);
    }
};