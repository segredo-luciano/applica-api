import { supabase } from "../config/supabase.js";
import * as recruiterRepository from "../repository/recruiter.repository.js";

const publicDomains = ["gmail.com", "outlook.com", "hotmail.com"];

export const register = async ({ name, email, password, company, company_domain }) => {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }

    let user = null;
    const domain = email.split("@")[1].toLowerCase();

    try {
        const { data: authData, error: authError } =
            await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
            });
    
        if (authError) throw authError;
    
        user = authData.user;
    
        const recruiter = await recruiterRepository.createRecruiter({
            name,
            email,
            company,
            company_domain,
            auth_user_id: user.id
        });
    
        return {
            user,
            recruiter
        };
    } catch (err) {
        console.error("Register error:", err.message);

        if (user?.id) {
            await supabase.auth.admin.deleteUser(user.id);
            console.log("Rollback: deleted auth user");
        }

        throw new Error(err.message);
  }
};

export const login = async ({ email, password }) => {

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw new Error(error);

  const user = data.user;
  const token = data.session.access_token;

  const recruiter = await recruiterRepository.findByAuthUserId(user.id);

  return {
    user,
    token,
    recruiter
  };
};

export const getRecruiterLoggedIn = async ( userId ) => {
    const resp = await recruiterRepository.findByAuthUserId(userId);
    return resp;
}