import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

export const supabaseMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      global: {
        headers: {
          Authorization: token || "",
        },
      },
    }
  );

  req.supabase = supabase;

  next();
};