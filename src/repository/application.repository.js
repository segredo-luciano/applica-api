export const insertApplication = async (supabase, input) => {
    const { data, error } = await supabase
        .from("application")
        .insert([input])        

    if(error) {
        console.log("[INSERT ERROR]: ", error);
        throw error;
    }

    return data;
};

export const getJobApplicationsRepository = async (supabase, page, jobId) => {
    let query = supabase
        .from('application')
        .select(`
            code,
            created_at,
            cv_url,
            status,
            viewed
            `, {count: 'exact'})
        .eq('job_post_id', jobId)

    page = page || 1;
    const limit = 1;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if(error) {
        console.error('eerr: ', error)
        throw error;
    }
    return {data, total: count, page, limit};
}