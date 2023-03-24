'use strict';

import { create, index, userWithChildren, userWithPopulatedChildren } from "../controllers/userController.js";
import express from 'express';
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router()

// create user
router.route('/')
    .post(authMiddleware, create);

// user with at least one child
router.route('/with-children')
    .get(authMiddleware, userWithChildren);

// get user with populated children
router.route('/:id/populated-children')
    .get(authMiddleware, userWithPopulatedChildren);

// get all users with pagination, free-text search, infinite child population, and parent_id = null
router.route('/')
    .get(authMiddleware, index)
export default router
