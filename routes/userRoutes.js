'use strict';

import { create, getAllUsersWithPagination, userWithChildren, userWithPopulatedChildren } from "../controllers/userController.js";
import express from 'express';
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router()

// Create users
router.route('/').post(authMiddleware, create);

// Get all users with pagination, free-text search, infinite child population
router.route('/').get(authMiddleware, getAllUsersWithPagination)

// user with at least one child
router.route('/with-children').get(authMiddleware, userWithChildren);

// get user with populated children
router.route('/:id/populated-children').get(authMiddleware, userWithPopulatedChildren);

export default router
