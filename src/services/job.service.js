import { createJob, getJobByCodeRepository, getJobsByFilter } from "../repository/job.repository.js";
import { getRecruiterByUserId } from "./recruiter.service.js";

export const createJobService = async (supabase, jobInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
    
  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: recruiter, error: recruiterError } = await supabase
    .from("recruiter")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (recruiterError || !recruiter) {
    throw new Error("Recrutador não identificado");
  }

  const jobData = {
    ...jobInput,
    recruiter_id: recruiter.id,
  };

  const job = await createJob(supabase, jobData);

  return job;
};

export const getJobByCode = async (supabase, jobId) => {
    return getJobByCodeRepository(supabase, jobId);
}

export const getJobByRecruiter = async (supabase, filter, userId) => {
    const recruiter = await getRecruiterByUserId(supabase, userId)
    filter = {...filter, recruiterId: recruiter.id}
    return getJobsByFilter(supabase, filter);
}

export const getJobListFiltered = async (supabase, filter) => {    
    return getJobsByFilter(supabase, filter);
}