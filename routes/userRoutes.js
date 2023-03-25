'use strict';

import { createAndUpdateUsers, getAllUsersWithPagination, userWithChildren, userWithPopulatedChildren } from "../controllers/userController.js";
import express from 'express';
import {authMiddleware} from "../middlewares/auth.js";

const router = express.Router()

// Create And Update users
router.route('/').post(authMiddleware, createAndUpdateUsers);

// Get all users with pagination, free-text search, infinite child population
router.route('/').get(authMiddleware, getAllUsersWithPagination)

// User with at least one child
router.route('/with-children').get(authMiddleware, userWithChildren);

// User with populated children
router.route('/:id/populated-children').get(authMiddleware, userWithPopulatedChildren);

export default router
