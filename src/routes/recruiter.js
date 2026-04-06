import express from "express";
import { getRecruiterLoggedInController, loginController, registerController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerController);
router.get("/login", loginController);
router.get('/get/loggedIn', authMiddleware, getRecruiterLoggedInController)

export default router;