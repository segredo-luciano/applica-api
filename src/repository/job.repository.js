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
        .select(`
            code,
            created_at,
            title,
            description,
            company, 
            limit_date,
            company_domain,
            recruiter_works_here
        `, { count: "exact" })

        const now = new Date();

        if (filter.range === "day") {
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            query = query.gte("created_at", last24h.toISOString());
        }

        if (filter.range === "week") {
            const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            query = query.gte("created_at", lastWeek.toISOString());
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

    const page = filter.page || 1;
    const limit = filter.limit || 1;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
        data,
        total: count,
        page,
        limit
    };
}