'use strict';

import { create, index } from "../controllers/userController.js";
import express from 'express';
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router()

// get All Users
router.route('/')
    .get(authMiddleware, index);

// create user
router.route('/')
    .post(authMiddleware, create);

export default router
