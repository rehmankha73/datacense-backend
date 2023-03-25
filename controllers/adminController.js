import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// ********** SignUp **********
export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'Please provide a valid email and password',
            });
        }

        // Hash password
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create admin record
        const admin = new Admin({
            email,
            password: hashedPassword,
        });

        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { _id: admin._id, email: admin.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            success: true,
            data: admin,
            access_token: token,
            message: 'Admin created successfully',
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
            message: 'An unexpected error occurred',
        });
    }
};

// ********** Login **********
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'Please provide a valid email and password',
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email }).exec();

        // Check if admin exists and password is correct
        if (!admin || !bcrypt.compare(password, admin.password)) {
            return res.status(401).json({
                success: false,
                error: 'Authentication Failed',
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { _id: admin._id, email: admin.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            access_token: token,
            message: 'Authentication Successful',
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
            message: 'An unexpected error occurred',
        });
    }
};


// ********** Admin Profile **********
export const profile = function (req, res) {
    try {
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                error: 'Authentication Required',
                message: 'You must be logged in to access this resource',
            });
        }

        res.json({
            success: true,
            data: req.admin,
            message: 'Profile retrieved successfully',
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Server error',
            message: 'An unexpected error occurred',
        });
    }
};
