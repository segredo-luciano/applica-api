export const insertApplication = async (supabase, data) => {
    const { data, error } = await supabase
        .from("application")
        .insert([data])        
        .select()
        .single();

    if(error) {
        console.log("[INSERT ERROR]: ", error);
        throw new Error(error.message);
    }

    return data;
};