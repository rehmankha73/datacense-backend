import express from "express";

import {signUp, signIn, profile} from "../controllers/adminController.js";
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router();

// Sign up route
router.route("/auth/sign-up").post(signUp);

// Sign in route
router.route("/auth/sign-in").post(signIn);

// Admin Profile route
router.route('/profile').get(authMiddleware, profile);

export default router