import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    veteran: {
        type: Boolean,
        default: false
    }
});

const User = new mongoose.model("User", UserSchema);

export default User;