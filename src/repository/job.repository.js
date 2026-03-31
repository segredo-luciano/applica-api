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

export const getJobsByFilter = async (supabase, filter) => {
    let query = supabase
        .from("job_post")
        .select("*")

        if(filter.startDate) {
            const start = new Date(filter.startDate);
            start.setHours(0, 0, 0, 0);

            query = query.gte("created_at", start.toISOString());
        }

        if (filter.endDate) {
            const end = new Date(filter.endDate);
            end.setHours(23, 59, 59, 999);

            query = query.lte("created_at", end.toISOString());
        }

        if(filter.companyName) {
            query = query.ilike('company_name', `%${filter.companyName}%`)
        }

        if(filter.title) {
            query = query.ilike('title', `%${filter.title}%`)
        }
        
    if (filter.mostRecent) {
        query = query.order("created_at", { ascending: false });
    } else {
        query = query.order("created_at", { ascending: true });
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
}