import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// ********** SignUp **********
const signUp = async (req, res, next) => {

    console.log('req.body: ', req.body);

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            success: false,
            error: "Send needed parameters",
            message: "Please fill out all fields"
        });
    }

    const name = req.body.name;
    const email = req.body.email;
    console.log('password: ', req.body.password);
    const password = bcrypt.hashSync(req.body.password, 10);
    console.log('password: ', password);

    // const password = await bcrypt.hash(req.body.password, 10);

    const admin = new Admin({
        name: name,
        email: email,
        password: password,
    });

    await admin.save();
    res.status(201).json({success: true, data: admin, message: "Admin created successfully"});

    // await admin.save((error, user) => {
    //     if (error) {
    //         return res.status(400).json({success: false, error: error, message: "Admin not created"});
    //     } else {
    //         return res.status(201).json({success: true, data: user, message: "Admin created successfully"});
    //     }
    // });
}

// ********** Login **********
const signIn = async (req, res, next) => {
    console.log('login');

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

    if (!admin || !admin.comparePassword(password)) {
        return res.status(401).json({message: 'Authentication failed. Invalid email or password.'});
    }

    return res.json({
        token: jwt.sign({
            email: admin.email,
            name: admin.name,
            _id: admin._id
        }, 'RESTFULAPIS')
    });

}

// ********** Admin Profile **********
const adminProfile = function (req, res, next) {
    if (req.admin) {
        res.send(req.admin);
        next();
    } else {
        return res.status(401).json({message: 'Auth Failed! Invalid token'});
    }
};

export {
    signUp,
    signIn,
    adminProfile
}