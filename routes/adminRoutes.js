import express from "express";

import { signUp, signIn, adminProfile } from "../controllers/adminController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// Sign up route
router.route("/auth/sign-up")
    .post(signUp);

// Sign in route
router.route("/auth/sign-in")
    .post(signIn);

// Auth User
router.route('/')
    .post(authMiddleware, adminProfile);

export default router