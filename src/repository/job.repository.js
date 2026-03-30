export const createJob = async (supabase, jobData) => {
    const { data, error } = await supabase
        .from("job_post")
        .insert([jobData])        
        .select()
        .single();

    if(error) {
        console.log("[INSERT ERROR]: ", error);
        throw new Error(error.message);
    }

    return data;
};

export const getJobByCodeRepository = async (supabase, code) => {
    const { data, error } = await supabase
        .from("job_post")
        .select("*")
        .eq("code", code)
        .maybeSingle();

    if (error) throw error;

    return data;
}