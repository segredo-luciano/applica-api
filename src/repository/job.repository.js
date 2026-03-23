export const createJob = async (supabase, jobData) => {
  const { data, error } = await supabase
    .from("job_post")
    .insert([jobData])
    .select()
    .single();

  if (error) throw error;

  return data;
};