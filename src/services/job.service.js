import { createJob } from "../repository/job.repository.js";

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
    throw new Error("Recruiter not found");
  }

  const jobData = {
    ...jobInput,
    recruiter_id: recruiter.id,
  };


  console.log("USER:", user?.id);
console.log("RECRUITER:", recruiter);
console.log("JOB DATA:", jobData);
  const job = await createJob(supabase, jobData);

  return job;
};