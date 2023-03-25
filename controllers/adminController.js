import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// ********** SignUp **********
const signUp = async (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            error: "Send needed parameters",
            message: "Please fill out all fields"
        });
    }

    const email = req.body.email;
    const password = bcrypt.hashSync(req.body.password, 10);

    const admin = new Admin({
        email: email,
        password: password,
    });

    await admin.save();
    res.status(201).json({
        success: true, data: admin,
        access_token: jwt.sign({
            _id: admin._id,
            email: admin.email,
            // 1 day
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        }, process.env.JWT_SECRET_KEY),
        message: "Admin created successfully"
    });
}

// ********** Login **********
const signIn = async (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            error: "Send needed parameters",
            message: "Please fill out all fields"
        });
    }

    const email = req.body.email;
    const password = req.body.password;

    const admin = await Admin.findOne({email: email}).exec();

    if (!admin || !bcrypt.compare(password, admin.password)) {
        return res.status(401).json({message: 'Authentication failed. Invalid email or password.'});
    }

    return res.json({
        access_token: jwt.sign({
            _id: admin._id,
            email: admin.email,
            // 1 day
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
        }, process.env.JWT_SECRET_KEY)
    });

}

// ********** Admin Profile **********
const profile = function (req, res, next) {
    if (req.admin) {
        res.send(req.admin);
    } else {
        return res.status(401).json({message: 'Auth Failed! Invalid token'});
    }
};

export {
    signUp,
    signIn,
    profile
}