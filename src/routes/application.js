import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";
import { applyToJob } from "../services/application.service.js";
import { applyToJobController } from "../controller/application.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// router.post("/a", upload.single("file"), async (req, res) => {
//   try {
//     const { job_post_id } = req.body;
//     const file = req.file;

//     if (!file || file.mimetype !== "application/pdf") {
//       return res.status(400).json({ error: "Only PDF allowed" });
//     }

//     const fileName = `${job_post_id}/${Date.now()}.pdf`;

//     const { error: uploadError } = await supabase.storage
//       .from("cvs")
//       .upload(fileName, file.buffer, {
//         contentType: "application/pdf"
//       });

//     if (uploadError) throw uploadError;

//     const { data, error } = await supabase
//       .from("application")
//       .insert([
//         {
//           job_post_id,
//           cv_url: fileName,
//           status: "NEW",
//           viewed: false
//         }
//       ])
//       .select();

//     if (error) throw error;

//     res.json(data);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

router.post("/", upload.single("cv_file"), applyToJobController)

export default router;