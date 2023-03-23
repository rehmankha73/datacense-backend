import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

AdminSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

const Admin = new mongoose.model("Admin", AdminSchema);

export default Admin