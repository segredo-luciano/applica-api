import { supabaseAdmin } from "../middleware/supabase";
import { v4 as uuidv4 } from "uuid";
import { insertApplication } from "../repository/application.repository";
import { base64ToBuffer, generateFileHash } from "../utils/file.util";

export const applyToJob = async (supabase, input) => {
    const { job_id, cv_base64 } = input;
    const { buffer, mime } = base64ToBuffer(cv_base64);
    const cv_hash = generateFileHash(buffer);
    const cv_url = await uploadCV(buffer, mime);

    const applyObj = {
        cv_hash,
        cv_url,
        status: "PENDING",
        job_id: job_id
    }

    return await insertApplication(supabase, applyObj);
}

const uploadCV = async (buffer, mime) => {
    const fileName = `${uuidv4()}.pdf`;

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