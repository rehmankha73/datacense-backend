import jsonwebtoken from "jsonwebtoken";
import Admin from "../models/Admin.js";

// is Valid token is parent in request
const authMiddleware = async (req, res, next) => {
    let verifyToken;

    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        verifyToken = jsonwebtoken.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIS');
    } else { verifyToken = null; }

    if(!verifyToken) res.status(401).json({message: 'Auth Failed! Invalid token'}) ;

    if (verifyToken) {
        req.admin = await Admin.findById(verifyToken._id).select('-password');
        next();
    }
}

export { authMiddleware };