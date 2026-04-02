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