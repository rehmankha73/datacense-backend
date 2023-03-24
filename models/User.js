import mongoose, {Schema} from 'mongoose';

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
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User' // optional, if you want to reference another model
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'User' // optional, if you want to reference another model
    }]
});

const User = new mongoose.model("User", UserSchema);

export default User;