import { supabase } from "../config/supabase.js";

export const createRecruiter = async (data) => {
    const { data: recruiter, error } = await supabase
        .from("recruiter")
        .insert(data)
        .select()
        .single();
    
    if (error) throw error;
    
    return recruiter;
};

export const findByAuthUserId = async (authUserId) => {
  const { data, error } = await supabase
    .from("recruiter")
    .select("*")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error);
  }
  return data;
};