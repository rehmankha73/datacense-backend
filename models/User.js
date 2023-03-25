import mongoose, {Schema} from 'mongoose';

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    veteran: {
        type: String,
        default: false
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }]
});

// Name & ID added in free-text search
UserSchema.index({  id: 'text', name: 'text' });

const User = new mongoose.model("User", UserSchema);

export default User;