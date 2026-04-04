export const getRecruiterByUserId = async (supabase, userId) => {
    const { data: recruiter, error: recruiterError } = await supabase
        .from("recruiter")
        .select("id")
        .eq("auth_user_id", userId)
        .single();

    if (recruiterError || !recruiter) {
        throw new Error("Recrutador não identificado");
    }

    return recruiter;
}