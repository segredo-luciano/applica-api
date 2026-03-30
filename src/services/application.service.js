import { supabaseAdmin } from "../middleware/supabase.js";
import { insertApplication } from "../repository/application.repository.js";
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
    const cv_url = await uploadCV(buffer, file.mimetype, job.id);

    const applyObj = {
        cv_hash,
        cv_url,
        status: APPLICATION_STATUS.PENDING,
        job_post_id: job.id
    }

    return await insertApplication(supabase, applyObj);
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

    return data.publicUrl;
};